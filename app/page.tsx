'use client'

import { BookOpenCheck } from "lucide-react"
import Cards from "../components/Cards";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    fetch('/api/subscribe', {
      method: "POST",
      body: JSON.stringify({ email })
    }).then((data: any) => {
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success('subscribed successfully');
      }
    }).catch(err => {
      toast.error('failed to subscribe')
    }).finally(() => {
      setEmail('');
    });
  }

  return (
    <div className="min-h-scree bg-white">
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <BookOpenCheck />
          <h1 className="text-2xl font-bold">Daily News</h1>
        </div>
        <nav className="flex items-center gap-6">
          <a href="/" className="hover:text-gray-500">About</a>
          <a href="/" className="hover:text-gray-500">Contact</a>
        </nav>
      </header>
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Daily Briefs of AI</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover the latest news and insights in the word of AI. Stay updated with the latest deveploments and trends in artificial intelligence
          </p>
        </div>
        <div className="text-center flex items-center justify-center gap-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" className="w-full max-w-md p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={handleSubscribe} className="bg-black text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors" >Subscribe</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <Cards title="AI" description="How AI is transforming headlthcare with precision diagnosis and treatment planning." />
          <Cards title="Startups" description="How AI is revolutionizing finance with fraud detection and portfoliom" />
          <Cards title="Tech" description="How AI is transforming education with personalized learning and adaptive teaching." />
        </div>
      </div>
    </div>
  );
}
