import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./auth/LoginForm";
import { RegisterForm } from "./auth/RegisterForm";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-2xl">
        <div className="h-1 bg-gradient-to-r from-turquoise-300 to-turquoise-500"></div>
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">
              {activeTab === "login" ? "Welcome Back" : "Create Account"}
            </DialogTitle>
          </DialogHeader>

          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "login" | "signup")}
            className="mt-6"
          >
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-turquoise-50 data-[state=active]:text-turquoise-700"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-turquoise-50 data-[state=active]:text-turquoise-700"
              >
                Sign up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-0">
              <LoginForm onSuccess={() => onOpenChange(false)} />
            </TabsContent>
            <TabsContent value="signup" className="mt-0">
              <RegisterForm onSuccess={() => onOpenChange(false)} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
