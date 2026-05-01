import { Button } from "@/components/ui/button";
import {Clock} from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Register() {
  return (
    <div className="grid grid-cols-2 justify-around items-center w-full h-screen">
      <div className="flex flex-col justify-center items-center bg-[#6C63FF] text-white h-full">
        <Clock size={60} className="mb-4" />
        <h1 className="text-5xl font-bold">School Scheduler</h1>
        <p>Register page content goes here</p>
      </div>

      <div className="bg-[#ffff] h-full items-center justify-center flex">
        <Card className="w-full max-w-sm bg-transparent border-none shadow-none ring-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Register for an account</CardTitle>
            <CardDescription>
              Enter your details below to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                  className="border-[#6C63FF]"
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input className="border-[#6C63FF]" id="password" type="password" required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2 bg-transparent">
            <Button type="submit" className="w-full">
              Register
            </Button>
            <Button variant="outline" className="w-full">
              Register with Google
            </Button>
            <CardAction>
              <Button variant="link">Already have an account? Log in</Button>
            </CardAction>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Register;
