
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { validateEmail } from "@/utils/emailValidation";

interface SignUpInitialFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  role: string;
  setRole: (role: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function SignUpInitialForm({
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  loading,
  onSubmit
}: SignUpInitialFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email (@university.edu or @gmail.com)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Use your university email (@university.edu) or Gmail account (@gmail.com)
        </p>
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Password must be at least 6 characters
        </p>
      </div>
      <div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="faculty">Faculty</SelectItem>
            <SelectItem value="alumni">Alumni</SelectItem>
            <SelectItem value="club_coordinator">Club Coordinator</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending verification code...
          </>
        ) : (
          "Send Verification Code"
        )}
      </Button>
    </form>
  );
}
