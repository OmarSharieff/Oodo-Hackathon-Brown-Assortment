import React, { useRef } from "react";
import * as Icons from "lucide-react";
import { CONFIG } from "../config/site";
import { Card } from "./ui/Card";
import { SectionHeading } from "./ui/SectionHeading";
import { useOnScreen } from "../hooks/useOnScreen";

export const Features = () => {
  const ref = useRef();
  const onScreen = useOnScreen(ref, "-50px");

  return (
    <section id="solution" className="py-24">
      <div className="container mx-auto px-6">
        <SectionHeading>Engineered for Impact</SectionHeading>

        <div ref={ref} className="grid md:grid-cols-3 gap-6 mt-12">
          {CONFIG.features.map((feature, index) => {
            const Icon = Icons[feature.icon];
            return (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  onScreen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <Card>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${CONFIG.theme.primary} flex items-center justify-center text-white mb-4`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
