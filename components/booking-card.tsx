import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"
import Link from "next/link"

export function BookingCard() {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border border-purple-500 shadow-xl hover:shadow-2xl transition">
      <CardHeader className="flex flex-col items-center">
        <CreditCard className="h-8 w-8 text-purple-400 mb-2" />
        <CardTitle className="text-white">Book Tickets</CardTitle>
      </CardHeader>
      <CardContent className="text-gray-200 text-center">
        Reserve seats instantly and enjoy a smooth booking experience.
        <div className="mt-4">
          <Link href="/booking-test">
            <Button size="sm" variant="outline">Book Now</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
