"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"
import { ImageSlider } from "@/components/layout/ImageSlider"
import { LoginForm } from "@/components/shared/forms/LoginForm"
import { CustomerSection } from "@/components/layout/CustomerSection"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)

    const success = await login(email, password)
    if (success) {
      router.push("/")
    } else {
      alert("Invalid credentials")
    }
    setIsLoading(false)
  }

  return (
    <section className="min-h-screen">
      <div className="flex flex-col min-h-screen lg:flex-row mx-auto py-[38px] px-[30px] gap-[24px]">
        <div className="flex-1 max-w-[676px] flex flex-col items-center justify-center bg-white gap-[24px]">
          <div className="w-full space-y-8 flex flex-column items-center justify-center flex-1 w-full bg-[var(--background)] rounded-[30px]">
            <div className="max-w-[412px]">
              {/* Logo */}
              <Image src="/images/logo.svg" height={120} width={120} alt="" className="mx-auto mb-[34px]" />

              {/* Heading */}
              <div className="text-center space-y-2 mb-[34px]">
                <h1 className="text-3xl lg:text-[30px] font-bold text-[var(--text)] leading-[1] mb-6 leading-tight">
                  Join us to start turning your vision into reality!
                </h1>
                <p className="text-[var(--text-secondary)] text-[18px]">Login now to get started!</p>
              </div>

              {/* Login Form */}
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            </div>
          </div>

          {/* Customer Section */}
          <CustomerSection />
        </div>

        {/* Right Section - Image Slider */}
        <ImageSlider />
      </div>
    </section>
  )
}
