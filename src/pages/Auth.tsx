import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "login" | "signup" | "verify";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [mockCode, setMockCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const generateMockCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setMockCode(code);
    setCountdown(60);
    toast({
      title: "验证码已发送",
      description: `Mock 验证码: ${code}`,
    });
  };

  const handleSendCode = () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "请输入有效的邮箱地址",
        variant: "destructive",
      });
      return;
    }
    generateMockCode();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "请填写邮箱和密码",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "登录失败",
        description: error.message === "Invalid login credentials" 
          ? "邮箱或密码错误" 
          : error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignup = async () => {
    if (!email || !password) {
      toast({
        title: "请填写邮箱和密码",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "密码至少需要6位",
        variant: "destructive",
      });
      return;
    }

    // Move to verification step
    setMode("verify");
    generateMockCode();
  };

  const handleVerifyAndSignup = async () => {
    if (verificationCode !== mockCode) {
      toast({
        title: "验证码错误",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    setLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast({
          title: "该邮箱已注册",
          description: "请直接登录",
          variant: "destructive",
        });
        setMode("login");
      } else {
        toast({
          title: "注册失败",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "注册成功",
        description: "正在登录...",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 h-12 border-b border-border/50">
        <button 
          onClick={() => mode === "verify" ? setMode("signup") : navigate("/")}
          className="p-1.5 -ml-1.5 rounded-md hover:bg-secondary/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-center text-[15px] font-medium text-foreground pr-8">
          {mode === "login" ? "登录" : mode === "signup" ? "注册" : "验证邮箱"}
        </h1>
      </header>

      <div className="flex-1 px-5 pt-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <span className="text-gmgn-green text-2xl font-bold">✦</span>
          <span className="font-bold text-foreground text-xl tracking-tight">GMGN</span>
        </div>

        {mode === "verify" ? (
          /* Verification Code Input */
          <div className="space-y-4">
            <p className="text-center text-muted-foreground text-sm mb-6">
              验证码已发送至 {email}
            </p>
            
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">验证码</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="请输入6位验证码"
                  className="flex-1 h-11 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gmgn-green"
                />
                <button
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                  className="px-3 h-11 rounded-lg bg-secondary border border-border text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  {countdown > 0 ? `${countdown}s` : "重新发送"}
                </button>
              </div>
            </div>

            <button
              onClick={handleVerifyAndSignup}
              disabled={loading || verificationCode.length !== 6}
              className="w-full h-11 rounded-lg bg-gmgn-green text-background font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity mt-6"
            >
              {loading ? "注册中..." : "确认注册"}
            </button>
          </div>
        ) : (
          /* Login/Signup Form */
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱地址"
                className="w-full h-11 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gmgn-green"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "设置密码（至少6位）" : "请输入密码"}
                className="w-full h-11 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gmgn-green"
              />
            </div>

            <button
              onClick={mode === "login" ? handleLogin : handleSignup}
              disabled={loading}
              className="w-full h-11 rounded-lg bg-gmgn-green text-background font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity mt-2"
            >
              {loading ? "处理中..." : mode === "login" ? "登录" : "下一步"}
            </button>

            <div className="flex items-center justify-center gap-1 pt-4">
              <span className="text-sm text-muted-foreground">
                {mode === "login" ? "还没有账号？" : "已有账号？"}
              </span>
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-sm text-gmgn-green font-medium"
              >
                {mode === "login" ? "立即注册" : "去登录"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-8 text-center">
        <p className="text-xs text-muted-foreground">
          继续使用即表示您同意我们的
          <button className="text-gmgn-green mx-0.5">服务条款</button>
          和
          <button className="text-gmgn-green mx-0.5">隐私政策</button>
        </p>
      </div>
    </div>
  );
}
