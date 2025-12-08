import React ,{ useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useToast } from '../hooks/useToast';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        addToast('Welcome back, Commander.', 'success');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        addToast('Identity created. Welcome to Kanoho.', 'success');
      }
    } catch (error: any) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden ">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-grid bg-[center_top_-1px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.2),transparent)]"></div>
      
      <div className="w-full max-w-[400px] p-10 relative overflow-hidden rounded-2xl border border-waveDark-600 shadow-2xl animate-float bg-wave-gradient dark:bg-ocean-gradient">
        {/* Decorative elements */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-waveDark-700 dark:via-waveLight-700 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-waveDark-700 dark:via-waveLight-700 to-transparent"></div>
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-white/5 rounded-xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
             <img src="https://res.cloudinary.com/djmakoiji/image/upload/v1764949083/image-3-removebg-preview_wkvbbz.png" alt="Kanoho logo" className="w-20 h-20 object-contain"/>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight mb-2">KANOHO AI</h1>
          <p className="text-zinc-500 text-[10px] font-mono tracking-[0.2em] uppercase">Enterprise Neural Interface</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {!isLogin && (
            <Input
              label="Full Name"
              type="text"
              required={!isLogin}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="J. Doe"
            />
          )}
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="agent@kanoho.ai"
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <div className="pt-2">
            <Button type="submit" className="w-full" isLoading={loading}>
              {isLogin ? 'Login' : 'Signup'}
            </Button>
          </div>
        </form>

        {/* <div className="mt-8 text-center pt-6 border-t border-white/5">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] text-zinc-500 hover:text-indigo-400 transition-colors font-mono tracking-widest uppercase"
          >
            {isLogin ? "Don't have an account Signup" : "Return to Login "}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Auth;