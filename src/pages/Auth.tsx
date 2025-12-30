import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiClient";
import { getAuthToken, setAuthToken } from "@/lib/authToken";

type AuthMode = "login" | "signup";

function getErrorCode(err: any): string {
  const msg = err?.message;
  return typeof msg === "string" && msg.length > 0 ? msg : "UNKNOWN_ERROR";
}

function getErrorStatus(err: any): number | null {
  const s = err?.status;
  return typeof s === "number" ? s : null;
}

function mapAuthError(err: any, kind: "login" | "signup"): string {
  const code = getErrorCode(err);
  const status = getErrorStatus(err);

  if (code === "NETWORK_ERROR") return "网络错误，请检查后端是否启动（默认 http://localhost:3001）";

  if (kind === "login") {
    if (status === 401 || code === "INVALID_CREDENTIALS") return "邮箱或密码错误";
    if (status === 400 || code === "INVALID_INPUT") return "请输入有效的邮箱和密码";
    return "登录失败，请稍后重试";
  }

  if (status === 409 || code === "EMAIL_ALREADY_EXISTS") return "该邮箱已注册，请直接登录";
  if (status === 400 || code === "INVALID_INPUT") return "邮箱或密码格式不正确（密码至少 6 位）";
  return "注册失败，请稍后重试";
}

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialMode = searchParams.get("mode");
    if (initialMode === "signup") setMode("signup");
    if (initialMode === "login") setMode("login");

    // Check if already logged in (token exists + /me ok)
    const token = getAuthToken();
    if (token) {
      apiRequest<{ ok: true }>("/api/auth/me", { method: "GET", token })
        .then(() => navigate("/"))
        .catch(() => {});
    }
  }, [navigate, searchParams]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "请填写邮箱和密码",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest<{ ok: true; token: string }>("/api/auth/login", {
        method: "POST",
        json: { email, password },
      });
      setAuthToken(data.token);
      navigate("/");
    } catch (err: any) {
      toast({
        title: "登录失败",
        description: mapAuthError(err, "login"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

    setLoading(true);
    try {
      const data = await apiRequest<{ ok: true; token: string }>("/api/auth/signup", {
        method: "POST",
        json: { email, password },
      });
      setAuthToken(data.token);
      navigate("/");
    } catch (err: any) {
      const status = getErrorStatus(err);
      const code = getErrorCode(err);
      if (status === 409 || code === "EMAIL_ALREADY_EXISTS") {
        toast({
          title: "该邮箱已注册",
          description: "请直接登录",
          variant: "destructive",
        });
        setMode("login");
      } else {
        toast({
          title: "注册失败",
          description: mapAuthError(err, "signup"),
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col mx-auto w-full max-w-[768px]">
      {/* Header */}
      <header className="flex items-center px-4 h-12 border-b border-border/50">
        <button 
          onClick={() => navigate("/")}
          className="p-1.5 -ml-1.5 rounded-md hover:bg-secondary/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-center text-[15px] font-medium text-foreground pr-8">
          {mode === "login" ? "登录" : "注册"}
        </h1>
      </header>

      <div className="flex-1 px-5 pt-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <span className="text-gmgn-green text-2xl font-bold">✦</span>
          <span className="font-bold text-foreground text-xl tracking-tight">GMGN</span>
        </div>

        {/* Login/Signup Form */}
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
            {loading ? "处理中..." : mode === "login" ? "登录" : "注册"}
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
