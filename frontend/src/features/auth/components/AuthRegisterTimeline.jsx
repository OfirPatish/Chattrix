import { UserPlus, User, Users, MessageSquare, Smile } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="text-primary bg-base-100 rounded-full p-1 shadow-md animate-bounce" size={28} />,
    label: "Create Account",
    description: "Sign up with your email and a secure password.",
    color: "border-primary",
    badge: "📝",
  },
  {
    icon: <User className="text-secondary bg-base-100 rounded-full p-1 shadow-md animate-bounce" size={28} />,
    label: "Set Up Profile",
    description: "Add your name, photo, and a short bio.",
    color: "border-secondary",
    badge: "🖼️",
  },
  {
    icon: <Users className="text-accent bg-base-100 rounded-full p-1 shadow-md animate-bounce" size={28} />,
    label: "Find Friends",
    description: "Connect with people you know or discover new friends.",
    color: "border-accent",
    badge: "🧑‍🤝‍🧑",
  },
  {
    icon: <MessageSquare className="text-info bg-base-100 rounded-full p-1 shadow-md animate-bounce" size={28} />,
    label: "First Chat",
    description: "Send your first message and break the ice!",
    color: "border-info",
    badge: "💬",
  },
  {
    icon: <Smile className="text-success bg-base-100 rounded-full p-1 shadow-md animate-bounce" size={28} />,
    label: "Enjoy Chattrix!",
    description: "Explore features, share files, and have fun.",
    color: "border-success",
    badge: "🎉",
  },
];

const StepBox = ({ label, badge, description }) => (
  <div className="timeline-box text-lg font-semibold bg-base-100/90 rounded-xl px-4 py-3 shadow-lg border border-base-300 flex flex-col items-start">
    <span className="flex items-center gap-2">
      {badge && <span className="text-xl animate-pulse">{badge}</span>}
      {label}
    </span>
    <div className="text-sm text-base-content/60 mt-1 font-normal">{description}</div>
  </div>
);

const AuthRegisterTimeline = ({ title, subtitle }) => (
  <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
    <div className="max-w-md w-full">
      <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>
      <p className="text-base-content/60 mb-8 text-center">{subtitle}</p>
      <ul className="timeline timeline-vertical">
        {steps.map((step, idx) => {
          const isLeft = idx % 2 === 0;
          return (
            <li key={idx}>
              {idx !== 0 && <hr className={`border-l-4 ${step.color} mx-auto`} />}
              {isLeft ? (
                <>
                  <div className="timeline-start">
                    <StepBox label={step.label} badge={step.badge} description={step.description} />
                  </div>
                  <div className={`timeline-middle ${step.color}`}>{step.icon}</div>
                  <div className="timeline-end"></div>
                </>
              ) : (
                <>
                  <div className="timeline-start"></div>
                  <div className={`timeline-middle ${step.color}`}>{step.icon}</div>
                  <div className="timeline-end">
                    <StepBox label={step.label} badge={step.badge} description={step.description} />
                  </div>
                </>
              )}
              {idx !== steps.length - 1 && <hr className={`border-l-4 ${step.color} mx-auto`} />}
            </li>
          );
        })}
      </ul>
    </div>
  </div>
);

export default AuthRegisterTimeline;
