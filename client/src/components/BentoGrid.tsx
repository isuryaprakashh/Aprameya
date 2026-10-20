import React from 'react';
import { Car, Plane, Cpu } from 'lucide-react';
import Detect from './ui/detect';

export const BentoGrid: React.FC = () => {
  const domains = [
    {
      id: "domain-vehicles",
      title: "Autonomous vehicles",
      desc: "Drive-by-wire conversion, multi-LiDAR perception, SLAM mapping, and path-planning on real physical testbeds.",
      icon: Car,
      image: "/assets/feature_vehicle.png",
      span: "lg:col-span-4",
    },
    {
      id: "domain-drones",
      title: "Aerial autonomy",
      desc: "Autonomous drone telemetry, visual-inertial odometry, PX4 flight controllers, and aerial inspection.",
      icon: Plane,
      image: "/assets/feature_navigation.png",
      span: "lg:col-span-2",
    },
    {
      id: "domain-robotics",
      title: "Robotics & Edge AI",
      desc: "Embedded inference on NVIDIA Jetson, ROS 2 distributed nodes, sensor fusion, and real-time control.",
      icon: Cpu,
      image: "/assets/feature_perception.png",
      span: "lg:col-span-6",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5">
        {domains.map((d) => {
          const Icon = d.icon;
          return (
            <Detect
              key={d.id}
              label="domain"
              id={d.id}
              as="article"
              className={`group relative overflow-hidden rounded-[var(--r-3)] border border-hairline min-h-[260px] sm:min-h-[280px] p-6 flex flex-col justify-end bg-surface-1 transition-colors duration-fast ${d.span}`}
            >
              {/* Real photo background with scrim */}
              <div className="absolute inset-0 z-0">
                <img
                  src={d.image}
                  alt={d.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-slow ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40 pointer-events-none" />
              </div>

              {/* Foreground content */}
              <div className="relative z-10 flex flex-col items-start text-left">
                <div className="w-9 h-9 rounded-[var(--r-1)] bg-ink/70 border border-hairline flex items-center justify-center text-signal-text mb-3 backdrop-blur-xs">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="font-sans font-medium text-[20px] text-paper tracking-[-0.01em] mb-2 leading-snug">
                  {d.title}
                </h3>

                <p className="font-sans text-[14px] text-text-2 leading-relaxed max-w-xl">
                  {d.desc}
                </p>
              </div>
            </Detect>
          );
        })}
      </div>
    </div>
  );
};

export default BentoGrid;
