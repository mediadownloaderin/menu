"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Logo from '@/components/ui/logo';
import { config } from '@/lib/config';
import { useAuth } from '@/lib/context/auth-context/auth-context';
import { Loader2 } from 'lucide-react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setToken } = useAuth();
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true)
    setErrorMessage("")

    try {
      const res = await fetch(`${config.backend_url}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile created Successfully");
        setToken(data.token);
        router.push('/menu-list')
      } else {
        setErrorMessage(data.error)
      }

    }
    catch (error) {
      setErrorMessage(`${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl overflow-hidden border border-red-100">
        <CardHeader className="flex flex-col items-center justify-center space-y-2 text-center">
          <Logo />
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-red-800">Create an Account</CardTitle>
            <CardDescription className="text-gray-600">
              Join us today and get started
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                placeholder="your@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            <Button
              disabled={isLoading}
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 transition-colors duration-200 shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : "Get Started"}
            </Button>

            {errorMessage && (
              <div className=" flex items-center p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {errorMessage}
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-red-600 hover:text-red-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUp