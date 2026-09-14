// src/inngest/functions.ts
import { featchAllNews, formatNewsSummary } from "@/lib/rss_utils";
import { inngest } from "./client";
import { Resend } from "resend";

export const processTask = inngest.createFunction(
    { id: "process-task", triggers: { event: "app/task.created" } },
    async ({ event, step }) => {
        const result = await step.run("handle-task", async () => {
            return { processed: true, id: event.data.id };
        });

        await step.sleep("pause", "1s");

        return { message: `Task ${event.data.id} complete`, result };
    }
);

export const sendDailyNews = inngest.createFunction({
    id: "send-daily-news",
    triggers: {
        // event: "test/send.daily.news"
        cron: "0 9 * * *"
    }
}, async ({ event, step }) => {
    // 1. 从多个RSS源获取新闻
    const newsItems = await step.run('fetch-news', async () => {
        const news = featchAllNews();
        return news;
    })

    // 2.整理新闻为每日摘要
    const newsSummary = await step.run('format-news', async () => {
        const summary = formatNewsSummary(newsItems);
        return summary;
    })

    // 3. 创建邮件内容
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const from = process.env.RESEND_FROM_EMAIL;
    if (!from) {
        throw new Error("RESEND_FROM_EMAIL is not configured");
    }

    const { data, error } = await step.run('create-email', async () => {
        const result = await resend.broadcasts.create({
            from,
            segmentId: "14ebb5b0-bad1-46ba-b181-176dd91ad5e6",
            subject: `Daily Briefs - ${new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}`,
            html: newsSummary.html
        })
        return result;
    });
    // 4. 发送邮件
    const { error: sendError } = await step.run("send-email", async () => {
        console.log("Sending email...");
        const result = await resend.broadcasts.send(data?.id!);
        return result;
    });

    if (sendError) {
        console.log("Error sending email:", sendError.message);
        return { error: sendError.message }
    }

})