import React from 'react';
import { Rocket, Zap, Shield } from 'lucide-react';

export const config = {
  appName: "XYZ",
  tagline: "Build the future, one hack at a time.",
  description: "An elegant, high-performance template designed to help you ship your hackathon project faster. Focus on the logic, we handled the UI.",
  primaryAction: "Launch Demo",
  secondaryAction: "View Source",
  features: [
    {
      title: "Instant Deploy",
      desc: "Push your code and see it live instantly with our pipeline.",
      icon: <Rocket className="w-6 h-6 text-indigo-500" />
    },
    {
      title: "Real-time Data",
      desc: "Built-in websocket support for live updates and interaction.",
      icon: <Zap className="w-6 h-6 text-indigo-500" />
    },
    {
      title: "Secure Core",
      desc: "Enterprise-grade encryption standard out of the box.",
      icon: <Shield className="w-6 h-6 text-indigo-500" />
    }
  ],
  team: [
    { name: "Omar Sharieff", role: "Full Stack" },
    { name: "Usman", role: "UI/UX" },
    { name: "Ivanna", role: "Backend" },
    { name: "Fahad", role: "idk" }
  ]
};
