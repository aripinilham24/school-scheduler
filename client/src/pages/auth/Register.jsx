import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(name, email, password);
      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil",
        text: "Silakan login dengan akun baru Anda",
      });
      navigate("/login");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Registrasi Gagal", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

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
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    className="border-[#6C63FF]"
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className="border-[#6C63FF]"
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    className="border-[#6C63FF]"
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Loading..." : "Register"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2 bg-transparent">
            <Button variant="outline" className="w-full">
              Register with Google
            </Button>
            <CardAction>
              <Button variant="link" asChild>
                <Link to="/login">Already have an account? Log in</Link>
              </Button>
            </CardAction>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Register;
