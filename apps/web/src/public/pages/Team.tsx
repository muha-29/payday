import { Linkedin, Twitter, Link as LinkIcon } from 'lucide-react';

type TeamMember = {
    name: string;
    role: string;
    bio: string;
    links?: {
        linkedin?: string;
        twitter?: string;
        portfolio?: string;
    };
};

const team: TeamMember[] = [
    {
        name: 'Lalit Chikker',
        role: 'Voice AI Coach',
        bio: 'Strategic Academic Leader | International Education Counsellor | Retail & Operations Expert | 30+ Years | Ex-Reliance, Landmark Group, Lovely Professional University',
        links: {
            linkedin: 'https://www.linkedin.com/in/lalit-chikker-822aa8312/',
        }
    },
    {
        name: 'Backend Lead',
        role: 'Systems & Scale',
        bio: 'Making PayDay fast, secure, and reliable.'
    },
    {
        name: 'Community',
        role: 'User Growth',
        bio: 'Listening to users and improving PayDay every day.'
    }, {
        name: 'Akash',
        role: 'Founder & Product',
        bio: 'Building PayDay to simplify money for everyday Indians.',
        links: {
            linkedin: 'https://linkedin.com/in/akash',
            twitter: 'https://x.com/akash'
        }
    },
    {
        name: 'Younus',
        role: 'Frontend & UX',
        bio: 'Frontend-focused Software Engineer with 5 years building scalable health-tech platforms. Proven expertise in React, Node.js & TypeScript, with a track record of optimizing performance and driving adoption.',
        links: {
            linkedin: 'https://www.linkedin.com/in/younus183/',
            portfolio: 'https://younus-portfolio.lovable.app',
            twitter: 'https://x.com/younus_183'
        }
    }
];

export default function Team() {
    return (
        <section className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-4">
                Meet the Team
            </h2>
            <p className="text-center text-stone-500 mb-12">
                People building PayDay for real-life money problems
            </p>

            {/* Row 1 */}
            <div className="flex justify-center mb-8">
                <TeamCard member={team[0]} />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <TeamCard member={team[1]} />
                <TeamCard member={team[2]} />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TeamCard member={team[3]} />
                <TeamCard member={team[4]} />
            </div>
        </section>
    );
}

/* ---------------- Card Component ---------------- */

function TeamCard({ member }: { member: TeamMember }) {
    return (
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 text-center">
            {/* Avatar */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center text-xl font-bold text-orange-600">
                {member.name.charAt(0)}
            </div>

            {/* Info */}
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-sm text-orange-500 mb-2">{member.role}</p>
            <p className="text-sm text-stone-500 mb-4">{member.bio}</p>

            {/* Social Links */}
            {member.links && (
                <div className="flex justify-center gap-4 mt-2">
                    {member.links.linkedin && (
                        <SocialLink href={member.links.linkedin} label="LinkedIn">
                            <Linkedin size={18} />
                        </SocialLink>
                    )}
                    {member.links.twitter && (
                        <SocialLink href={member.links.twitter} label="X">
                            <Twitter size={18} />
                        </SocialLink>
                    )}
                    {member.links.portfolio && (
                        <SocialLink href={member.links.portfolio} label="Portfolio">
                            <LinkIcon size={18} />
                        </SocialLink>
                    )}
                </div>
            )}
        </div>
    );
}

/* ---------------- Reusable Icon Link ---------------- */

function SocialLink({
    href,
    label,
    children
}: {
    href: string;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-stone-400 hover:text-orange-500 transition"
        >
            {children}
        </a>
    );
}