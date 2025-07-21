import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Train, Shield, Users, BarChart3, MapPin, AlertTriangle, Clock, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Train className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Railway Management System</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/user">
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  User Portal
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Advanced Railway Safety & Management System</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Real-time train tracking, intelligent safety monitoring, and comprehensive passenger services for
            Karnataka's railway network.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/user">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Users className="h-5 w-5 mr-2" />
                Access User Services
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

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">System Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-6 w-6 text-green-600 mr-2" />
                  Live Train Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Real-time GPS tracking of all trains with live status updates, delay notifications, and route
                  visualization.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                  Safety Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI-powered collision detection, emergency response systems, and predictive safety analytics to prevent
                  accidents.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Train className="h-6 w-6 text-blue-600 mr-2" />
                  Passenger Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ticket booking, PNR status checking, seat assignment, and real-time journey information for
                  passengers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-6 w-6 text-purple-600 mr-2" />
                  Analytics Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive analytics on train performance, passenger flow, safety metrics, and operational
                  efficiency.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-6 w-6 text-orange-600 mr-2" />
                  Delay Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Intelligent delay prediction, automatic notifications, and dynamic schedule adjustments to minimize
                  disruptions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-6 w-6 text-yellow-600 mr-2" />
                  Emergency Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Rapid emergency detection, automated alert systems, and coordinated response protocols for critical
                  situations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Active Trains</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">99.2%</div>
              <div className="text-gray-600">Safety Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Daily Passengers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Train className="h-6 w-6 mr-2" />
                <span className="text-lg font-semibold">Railway Safety System</span>
              </div>
              <p className="text-gray-400">
                Advanced railway management and safety monitoring system for Karnataka's rail network.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/user" className="hover:text-white">
                    User Portal
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white">
                    Admin Dashboard
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Safety Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Emergency Contacts
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Emergency: 112</li>
                <li>Railway Helpline: 139</li>
                <li>Email: safety@railway.gov.in</li>
                <li>24/7 Support Available</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Railway Safety System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
