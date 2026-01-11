import { useEffect, useState } from "react";
import API from "../api/api";
import ActivityCalendar from "../components/ActivityCalender";
import Navbar from "../components/Navbar";
import { User, Mail, Calendar, ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await API.get("/user/profile");
                setUser(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchProfile();
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <Navbar />
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-full"></div>
                        <div className="h-4 w-32 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Navbar />
            <main className="container mx-auto px-4 md:py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header & Navigation */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                User <span className="text-orange-500 underline decoration-orange-500/30">Profile</span>
                            </h1>
                            <p className="text-muted-foreground">
                                Manage your personal information and track your coding journey.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/home')}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95 w-fit group shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>
                    </div>

                    {/* Profile Card */}
                    <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
                        {/* Left Column: Stats/Avatar */}
                        <div className="space-y-6">
                            <div className="p-8 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl shadow-xl shadow-orange-500/5 flex flex-col items-center text-center space-y-4">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/30 text-white">
                                    <span className="text-4xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{user.name}</h2>
                                    <p className="text-muted-foreground font-medium">@{user.username}</p>
                                </div>
                                <div className="pt-4 w-full border-t border-border/50 flex flex-col gap-3 text-sm">
                                    <div className="flex items-center gap-3 text-foreground/80">
                                        <Mail className="w-4 h-4 text-orange-500" />
                                        {user.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-foreground/80">
                                        <Calendar className="w-4 h-4 text-orange-500" />
                                        Joined {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Activity */}
                        <div className="space-y-6 min-w-0">
                            <div className="p-8 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl shadow-xl shadow-orange-500/5 h-full">
                                <ActivityCalendar loginActivity={user.loginActivity} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
