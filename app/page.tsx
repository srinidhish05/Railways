import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SystemHealth from "@/components/system-health"
import { Train, Shield, Users, BarChart3, MapPin, AlertTriangle, Clock, Zap, Search, CreditCard, TrendingUp } from "lucide-react"
import Link from "next/link"


export default function HomePage() {
  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 animated-overlay"></div>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 transition-shadow backdrop-blur bg-gray-900/90 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Train className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-400 text-transparent bg-clip-text">NamaTrain AI</h1>
                <p className="text-gray-200 text-lg">Live Train Tracking & Booking System</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link href="/user">
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Passenger Portal
                </Button>
              </Link>
              <Link href="/admin">
                <Button>
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-500 to-blue-400 text-transparent bg-clip-text drop-shadow-lg">AI-Powered Railway Safety & Smart Ticketing</h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">Collision prevention, passenger protection, and real-time train tracking for a safer, smarter railway experience.</p>
          <div className="flex justify-center space-x-4 flex-wrap gap-4 items-center">
            <Link href="/user">
              <Button size="lg" variant="outline" className="shadow-lg flex items-center justify-center gap-2">
                <Users className="h-5 w-5" />
                <span>Track Trains</span>
              </Button>
            </Link>
            <Link href="/booking-test">
              <Button size="lg" variant="outline" className="shadow-lg flex items-center justify-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span>Book Tickets</span>
              </Button>
            </Link>
            <Link href="/smart-ticket-capping-demo">
              <Button size="lg" variant="outline" className="shadow-lg flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>Smart Ticket Capping</span>
              </Button>
            </Link>
            <Link href="/status-section">
              <Button size="lg" variant="outline" className="shadow-lg flex items-center justify-center gap-2">
                <Zap className="h-5 w-5" />
                <span>Train Status</span>
              </Button>
            </Link>
            <Link href="/pnr-status">
              <Button size="lg" variant="outline" className="shadow-lg flex items-center justify-center gap-2">
                <Search className="h-5 w-5" />
                <span>PNR Status</span>
              </Button>
            </Link>
            <Link href="/find-trains">
              <Button size="lg" variant="outline" className="shadow-lg flex items-center justify-center gap-2">
                <Train className="h-5 w-5" />
                <span>Find Trains</span>
              </Button>
            </Link>
            <div className="ml-4"><SystemHealth /></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-transparent pointer-events-none z-0" />
      </section>

      {/* Quick Railway Services Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Quick Railway Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Row 1 */}
            <Card className="bg-white/10 backdrop-blur-lg border border-purple-500 shadow-xl hover:shadow-2xl transition">
              <CardContent className="p-6 text-center">
                <Search className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">PNR Status</h4>
                <p className="text-blue-200 text-sm mb-4">Check ticket status instantly</p>
                <Link href="/pnr-status"><Button size="sm" variant="outline">Check Now</Button></Link>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-green-500 shadow-xl hover:shadow-2xl transition">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-green-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">Live Tracking</h4>
                <p className="text-green-200 text-sm mb-4">Track any train in real-time</p>
                <Link href="/trains"><Button size="sm" variant="outline">Track Train</Button></Link>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-purple-500 shadow-xl hover:shadow-2xl transition">
              <CardContent className="p-6 text-center">
                <Train className="h-8 w-8 text-purple-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">Find Trains</h4>
                <p className="text-purple-200 text-sm mb-4">Search trains between stations</p>
                <Link href="/find-trains"><Button size="sm" variant="outline">Find Trains</Button></Link>
              </CardContent>
            </Card>
            {/* Row 2 */}
            <Card className="bg-white/10 backdrop-blur-lg border border-blue-500 shadow-xl hover:shadow-2xl transition">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">Delay Alerts</h4>
                <p className="text-blue-200 text-sm mb-4">Get real-time delay notifications</p>
                <Link href="/status-section"><Button size="sm" variant="outline">View Status</Button></Link>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-green-500 shadow-xl hover:shadow-2xl transition">
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-green-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">Safety Dashboard</h4>
                <p className="text-green-200 text-sm mb-4">Monitor railway safety metrics</p>
                <Link href="/safety-dashboard"><Button size="sm" variant="outline">View Safety</Button></Link>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-purple-500 shadow-xl hover:shadow-2xl transition">
              <CardContent className="p-6 text-center">
                <CreditCard className="h-8 w-8 text-purple-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">Book Tickets</h4>
                <p className="text-purple-200 text-sm mb-4">Reserve seats instantly</p>
                <Link href="/booking-test"><Button size="sm" variant="outline">Book Now</Button></Link>
              </CardContent>
            </Card>
            {/* Row 3 */}
            <Card className="bg-white/10 backdrop-blur-lg border border-blue-500 shadow-xl hover:shadow-2xl transition">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">Analytics</h4>
                <p className="text-blue-200 text-sm mb-4">View network analytics</p>
                <Link href="/railway-demo"><Button size="sm" variant="outline">View Analytics</Button></Link>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-green-500 shadow-xl hover:shadow-2xl transition">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">Smart Ticket Capping</h4>
                <p className="text-green-200 text-sm mb-4">Save on frequent travel</p>
                <Link href="/smart-ticket-capping-demo"><Button size="sm" variant="outline">Learn More</Button></Link>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-purple-500 shadow-xl hover:shadow-2xl transition">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2 text-white">Passenger Portal</h4>
                <p className="text-purple-200 text-sm mb-4">Access your dashboard</p>
                <Link href="/user"><Button size="sm" variant="outline">Go to Portal</Button></Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-white mb-12">System Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-lg border border-blue-500 shadow-xl">
              <CardHeader className="flex flex-col items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-400 mb-2" />
                <CardTitle className="text-white">Collision Prevention</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200 text-center">AI-powered algorithms monitor and prevent train collisions in real-time.</CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-green-500 shadow-xl">
              <CardHeader className="flex flex-col items-center">
                <Shield className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle className="text-white">Passenger Safety</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200 text-center">Live alerts and monitoring for passenger protection and emergency response.</CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-purple-500 shadow-xl">
              <CardHeader className="flex flex-col items-center">
                <Clock className="h-8 w-8 text-purple-400 mb-2" />
                <CardTitle className="text-white">Delay Management</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200 text-center">Smart delay prediction and management for efficient travel planning.</CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-blue-500 shadow-xl">
              <CardHeader className="flex flex-col items-center">
                <Zap className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">Real-Time Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200 text-center">Track trains live across the Karnataka railway network.</CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-green-500 shadow-xl">
              <CardHeader className="flex flex-col items-center">
                <BarChart3 className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle className="text-white">Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200 text-center">Comprehensive analytics for network health and performance.</CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-purple-500 shadow-xl">
              <CardHeader className="flex flex-col items-center">
                <Users className="h-8 w-8 text-purple-400 mb-2" />
                <CardTitle className="text-white">Smart Ticketing</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200 text-center">AI-driven ticket capping and booking for cost-effective travel.</CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-white mb-12">Karnataka Railway Network Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <Card className="bg-white/10 backdrop-blur-lg border border-blue-500 shadow-xl">
              <CardContent className="py-8">
                <h4 className="text-4xl font-extrabold text-blue-400 mb-2">120+</h4>
                <p className="text-gray-200">Active Trains</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-green-500 shadow-xl">
              <CardContent className="py-8">
                <h4 className="text-4xl font-extrabold text-green-400 mb-2">300+</h4>
                <p className="text-gray-200">Stations</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-purple-500 shadow-xl">
              <CardContent className="py-8">
                <h4 className="text-4xl font-extrabold text-purple-400 mb-2">150K+</h4>
                <p className="text-gray-200">Daily Passengers</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-yellow-500 shadow-xl">
              <CardContent className="py-8">
                <h4 className="text-4xl font-extrabold text-yellow-400 mb-2">99.9%</h4>
                <p className="text-gray-200">Safety Record</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4 text-purple-400">About</h4>
              <p className="text-gray-300 text-sm">NamaTrain AI is a next-gen railway management system for Karnataka, focused on safety, smart ticketing, and real-time tracking.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-blue-400">Quick Links</h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li><Link href="/user">Passenger Portal</Link></li>
                <li><Link href="/booking-test">Book Tickets</Link></li>
                <li><Link href="/admin">Admin Dashboard</Link></li>
                <li><Link href="/smart-ticket-capping-demo">Smart Ticket Capping Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-green-400">Contact</h4>
              <p className="text-gray-300 text-sm">Email: support@namatrain.ai<br />Phone: +91-12345-67890</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-yellow-400">Follow Us</h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-100">
            <p>&copy; 2024 Karnataka Railway Network. All rights reserved. | Powered by Indian Railways</p>
          </div>
        </div>
      </footer>
      <style>{`
        .animated-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.7;
          background: radial-gradient(circle at 20% 40%, #38bdf8 0%, transparent 60%),
                      radial-gradient(circle at 80% 60%, #6366f1 0%, transparent 60%);
          animation: overlayFade 3s ease-in-out infinite alternate;
        }
        @keyframes overlayFade {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}