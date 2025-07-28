import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Train, Shield, Users, BarChart3, MapPin, AlertTriangle, Clock, Zap, Search, CreditCard } from "lucide-react"
import Link from "next/link"


export default function HomePage() {
  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 transition-shadow backdrop-blur bg-gray-900/90 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Train className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-400 text-transparent bg-clip-text">NamaTrain AI</h1>
                <p className="text-gray-300">Live Train Tracking & Booking System</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link href="/user">
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Passenger Portal
                </Button>
              </Link>
              <Link href="/booking-test">
                <Button variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Book Tickets
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
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-400 text-transparent bg-clip-text">AI-POWERED RAILWAY SAFETY AND SMART TICKETING SYSTEM FOR COLLISION PREVENTION AND PASSENGER PROTECTION</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          </p>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-400 text-transparent bg-clip-text">
            AI-POWERED RAILWAY SAFETY AND SMART TICKETING SYSTEM FOR COLLISION PREVENTION AND PASSENGER PROTECTION
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"></p>
          <div className="flex justify-center space-x-4 flex-wrap gap-4">
            <Link href="/user">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Users className="h-5 w-5 mr-2" />
                Track Trains
              </Button>
            </Link>
            <Link href="/booking-test">
              <Button size="lg" variant="outline">
                <CreditCard className="h-5 w-5 mr-2" />
                Book Tickets
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="lg" variant="outline">
                <BarChart3 className="h-5 w-5 mr-2" />
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Search Section */}
      {/* Quick Railway Services Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-white-900 mb-8">Quick Railway Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 text-gray-100 border border-gray-700 shadow-md hover:shadow-lg transition">
              <CardContent className="p-6 text-center">
                <Search className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">PNR Status</h4>
                <p className="text-blue-300 text-sm mb-4">Check ticket status instantly</p>
                <Button size="sm" variant="outline">Check Now</Button>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 text-gray-100 border border-gray-700 shadow-md hover:shadow-lg transition">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Live Tracking</h4>
                <p className="text-green-300 text-sm mb-4">Track any train in real-time</p>
                <Button size="sm" variant="outline">Track Train</Button>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 text-gray-100 border border-gray-700 shadow-md hover:shadow-lg transition">
              <CardContent className="p-6 text-center">
                <Train className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Find Trains</h4>
                <p className="text-purple-300 text-sm mb-4">Search trains between stations</p>
                <Button size="sm" variant="outline">Find Trains</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-white-900 mb-12">System Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-800 text-gray-100 border border-gray-700 shadow-md hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-6 w-6 text-green-600 mr-2" />
                  Live Train Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Real-time GPS tracking of Karnataka Express, Kaveri Express, and all major trains with live status updates and delay notifications.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 text-gray-100 border border-gray-700 shadow-md hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
                  Ticket Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Easy online booking for all Karnataka routes including SBC-NDLS, MYS-MAS, and popular destinations with seat selection.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 text-gray-100 border border-gray-700 shadow-md hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-6 w-6 text-purple-600 mr-2" />
                  PNR Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Instant PNR status checking with detailed journey information, seat allocation, and boarding station details.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 text-gray-100 border border-gray-700 shadow-md hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-6 w-6 text-orange-600 mr-2" />
                  Analytics Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Comprehensive analytics on train performance, passenger flow, and operational efficiency across Karnataka network.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 text-gray-100 border border-gray-700 shadow-md hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-6 w-6 text-red-600 mr-2" />
                  Delay Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Intelligent delay prediction and automatic notifications to keep passengers informed about schedule changes.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 text-gray-100 border border-gray-700 shadow-md hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
                  Safety Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Advanced safety monitoring with emergency response systems and real-time alerts for passenger safety.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-white-900 mb-12">Karnataka Railway Network Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-gray-300">Active Trains</div>
              <div className="text-sm text-blue-500 mt-1">Daily Operations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">450+</div>
              <div className="text-gray-300">Railway Stations</div>
              <div className="text-sm text-green-500 mt-1">Across Karnataka</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">2M+</div>
              <div className="text-gray-300">Monthly Passengers</div>
              <div className="text-sm text-purple-500 mt-1">Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-300">Live Tracking</div>
              <div className="text-sm text-orange-500 mt-1">Real-time Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Train className="h-6 w-6 mr-2" />
                <span className="text-lg font-semibold">NammaTrain AI</span>
              </div>
              <p className="text-yellow-400">
                Complete railway management system for Karnataka with live tracking, booking, and passenger services.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/user" className="hover:text-white">Live Train Tracking</Link></li>
                <li><Link href="/booking-test" className="hover:text-white">Ticket Booking</Link></li>
                <li><a href="#" className="hover:text-white">PNR Status</a></li>
                <li><a href="#" className="hover:text-white">Route Planning</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/user" className="hover:text-white">Passenger Portal</Link></li>
                <li><Link href="/admin" className="hover:text-white">Admin Dashboard</Link></li>
                <li><a href="#" className="hover:text-white">Station Directory</a></li>
                <li><a href="#" className="hover:text-white">Train Schedule</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact & Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Emergency: 112</li>
                <li>Railway Helpline: 139</li>
                <li>IRCTC Support: 14646</li>
                <li>Email: help@karnatakarailway.in</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-100">
            <p>&copy; 2024 Karnataka Railway Network. All rights reserved. | Powered by Indian Railways</p>
          </div>
        </div>
      </footer>
    </div>
  )
}