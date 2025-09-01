'use client'

import React, { useState, useEffect } from 'react';
import { AlertCircle, Phone, Dog, Pill, Home, Calendar, Droplets, Cookie, MapPin, Heart, Edit, Save, Plus, Trash2, Clock, CheckSquare, Wifi, Tv, Volume2, Thermometer, Bath, Key, Trash, Users, DollarSign, Settings, ChevronRight, Shield, Lock, QrCode } from 'lucide-react';

// Simulated database - in production, this would connect to Supabase
const initialData = {
  property: {
    address: "9441 Alto Drive, La Mesa, CA 91941",
    wifi: {
      ssid: "Frenchie Den / Frenchie Den2",
      password: "Fir3fly1"
    }
  },
  alerts: [
    { id: 1, type: 'danger', category: 'pets', text: "COYOTES PRESENT IN BACKYARD - Never let dogs outside unattended" },
    { id: 2, type: 'warning', category: 'pets', text: "No dogs on the Office Patio during this visit" },
    { id: 3, type: 'warning', category: 'pets', text: "Keep patio steel door fully shut - Dogs will escape if left ajar" },
    { id: 4, type: 'info', category: 'house', text: "Septic system - Only flush toilet paper" }
  ],
  contacts: {
    owners: [
      { name: "Adam", phone: "816-676-8363" },
      { name: "Lauren", phone: "913-375-8699" }
    ],
    regularVet: {
      name: "Fletcher Hills Animal Hospital",
      address: "8807 Grossmont Blvd, La Mesa, CA 91942",
      phone: "619-463-6604"
    },
    emergencyVet: {
      name: "Veterinary Specialty Hospital of San Diego",
      address: "10435 Sorrento Valley Road, San Diego, CA 92121",
      phone: "858-875-7500"
    },
    services: [
      { name: "Hot Tub Maintenance", phone: "Contact info on file", notes: "Has your contact info" },
      { name: "Antonio (Gardener)", phone: "Contact owners", notes: "Payment needed" }
    ]
  },
  dogs: [
    {
      id: 1,
      name: "Pâté",
      age: "1+ year",
      photo: "🐕",
      personality: "Gets 'sharkey' (goes crazy with mouth) but calms quickly. May run to hot tub area or bottom yard when let out. Likes to steal laundry.",
      feeding: {
        schedule: [
          { time: "7:00 AM", amount: "1½ cups refrigerated food" },
          { time: "6:00 PM", amount: "1½ cups refrigerated food" }
        ],
        notes: "When container empties: logs in bottom right refrigerator drawer, use black gloves to break up to ground beef consistency",
        location: "Refrigerator"
      },
      medicine: {
        schedule: [
          { time: "Evening", medication: "1 Benadryl (25mg) with food" }
        ],
        notes: ""
      },
      potty: {
        trained: "99% trained but needs frequent trips outside",
        notes: "Often needs verbal command 'go potty'. May need baby wipes after."
      },
      walks: {
        frequency: "Optional walks only",
        notes: "Leash in laundry room"
      },
      sleeping: {
        location: "Normally sleeps with owners",
        notes: "Alternative: Keep in kitchen"
      },
      special: {
        whenLeaving: "Goes in small cage (office or dining room)",
        management: "Keep bedroom doors closed to prevent accidents/mischief"
      }
    },
    {
      id: 2,
      name: "Barolo",
      age: "5 years",
      photo: "🐕‍🦺",
      personality: "Can be territorial (watch for ears back - separate dogs if needed). Responds to shaking a dish towel at him.",
      feeding: {
        schedule: [
          { time: "7:00 AM", amount: "3/4 cup dry food" },
          { time: "6:00 PM", amount: "3/4 cup dry food" }
        ],
        notes: "Separate dogs across room when feeding. Pick up and rinse bowls immediately.",
        location: "Bottom drawer right of stove"
      },
      medicine: {
        schedule: [
          { time: "Morning", medication: "1 Benadryl (25mg)" },
          { time: "Evening", medication: "1 Benadryl (25mg) + 1 allergy pill from freezer (via pill pocket)" }
        ],
        notes: "Wipe top of head once daily with wipes. Currently on medicine for diarrhea."
      },
      potty: {
        trained: "Fully trained",
        notes: "May whine to go outside at night. May need baby wipes for cleanup. If won't come back, use leaf blower trigger."
      },
      walks: {
        frequency: "Loves long daily walks",
        notes: "Use black harness on left side. Not good with other dogs - redirect if you see any."
      },
      sleeping: {
        location: "Normally sleeps with owners",
        notes: "Alternative: Keep in kitchen"
      },
      special: {
        whenLeaving: "Can stay in kitchen with gate closed",
        management: "Use cage in living room if dogs need separation"
      }
    }
  ],
  houseInstructions: {
    access: {
      mudRoom: "Keypad on wood panel outside. Enter code + red button to lock/unlock. Inside: turn cylinder right to lock.",
      patioDoor: "Barolo can nudge it open - must be locked when not in use"
    },
    entertainment: {
      tv: "LG Remote left of TV. Press house button for apps. Apple TV is default. Use iPhone Remote app or small Apple remote by fireplace.",
      sonos: "Speakers in kitchen, living room, patio, office, guest bedroom. Auto-switches with TV. Control via SONOS app on WiFi."
    },
    utilities: {
      lights: "Kitchen: Say 'Alexa, turn on/off all kitchen'. Living room: Auto at sunset, off at 11:59pm.",
      thermostat: "Set to heat/AC auto. Adjust via touchscreen. DO NOT turn completely off.",
      septic: "Only flush toilet paper - nothing else!",
      bathroom: "Hall bathroom for your use. Turn on middle switch for shower. Other switches have motion sensors."
    },
    amenities: {
      hotTub: "Free to use. Undo 2 straps, fold cover in half into lifter. Towels in hall closet.",
      trash: "Pickup early Monday AM. Put bins out Sunday night, return after emptying."
    }
  },
  appointments: [
    {
      id: 1,
      date: "Friday 6/6",
      time: "9:30 AM",
      type: "Vet - Shot",
      who: "Pâté",
      location: "Regular Vet",
      notes: "Take ziplock bag from counter. Serum in refrigerator (top right next to jalapeños, marked #2). Dose: 1.0 ml"
    }
  ],
  servicePeople: [
    {
      id: 1,
      name: "Hot Tub Maintenance",
      day: "Tuesday",
      time: "Varies",
      payment: "Pre-paid",
      notes: "Comes to backyard. Will text you heads-up.",
      needsAccess: true
    },
    {
      id: 2,
      name: "Antonio",
      day: "Friday 9/6",
      time: "TBD",
      payment: "$125.00 cash",
      notes: "Needs to be paid when done",
      needsAccess: true
    }
  ],
  dailyTasks: [
    { id: 1, category: 'pets', task: 'Morning feeding & medicine', time: '7:00 AM' },
    { id: 2, category: 'pets', task: 'Evening feeding & medicine', time: '6:00 PM' },
    { id: 3, category: 'pets', task: 'Barolo head wipe', time: 'Once daily' },
    { id: 4, category: 'pets', task: 'Walk Barolo', time: 'Daily' },
    { id: 5, category: 'house', task: 'Refill water bowls', time: 'As needed' },
    { id: 6, category: 'pets', task: 'Multiple potty breaks', time: 'Throughout day' },
    { id: 7, category: 'house', task: 'Check patio door is locked', time: 'Before bed' }
  ]
};

export default function HouseSittingApp() {
  const [data, setData] = useState(initialData);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // In production, this would be stored securely in environment variables
  const SITE_PASSWORD = process.env.NEXT_PUBLIC_SITE_ACCESS_PASSWORD || 'frenchies2024';

  // Check for password in URL params on mount (for QR code)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPassword = urlParams.get('access');
    if (urlPassword === SITE_PASSWORD) {
      setIsAuthenticated(true);
      // Clean up URL to remove password
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Login Component
  const LoginScreen = () => {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (password === SITE_PASSWORD) {
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError('Incorrect password. Please try again.');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">House Sitting Portal</h1>
            <p className="text-gray-600">9441 Alto Drive, La Mesa</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Access Instructions
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <QrCode className="w-4 h-4" />
              <p>Have a QR code? Scan it to auto-login</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Contact Adam or Lauren if you need access
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Navigation Component
  const Navigation = () => {
    const sections = [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'dogs', label: 'Pet Care', icon: Dog },
      { id: 'house', label: 'House Instructions', icon: Key },
      { id: 'services', label: 'Service People', icon: Users },
      { id: 'schedule', label: 'Schedule', icon: Calendar }
    ];

    return (
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <h1 className="text-2xl font-bold text-gray-800">House Sitting Portal</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-2 text-gray-600 hover:text-gray-800"
                title="Lock"
              >
                <Lock className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className={`px-4 py-2 rounded-md ${
                  isAdmin ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {isAdmin ? 'Admin Mode' : 'Sitter View'}
              </button>
            </div>
          </div>
          <div className="flex space-x-1 overflow-x-auto pb-2">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Overview Section
  const OverviewSection = () => (
    <div className="space-y-6">
      {/* Property Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Property Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Address</p>
            <p className="font-medium">{data.property.address}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">WiFi</p>
            <p className="font-medium">Network: {data.property.wifi.ssid}</p>
            <p className="font-medium">Password: {data.property.wifi.password}</p>
          </div>
        </div>
      </div>

      {/* All Alerts */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-red-800">Important Alerts</h2>
        </div>
        <div className="space-y-2">
          {data.alerts.map(alert => (
            <div key={alert.id} className={`flex items-start gap-2 ${
              alert.type === 'danger' ? 'text-red-700' : 
              alert.type === 'warning' ? 'text-orange-700' : 'text-blue-700'
            }`}>
              <span className="font-bold">•</span>
              <span className="font-medium">{alert.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All Contacts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold">Emergency Contacts</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2 text-gray-800">Owners</h3>
            {data.contacts.owners.map((owner, idx) => (
              <p key={idx} className="text-gray-700">{owner.name}: {owner.phone}</p>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-800">Regular Vet</h3>
            <p className="text-sm font-medium">{data.contacts.regularVet.name}</p>
            <p className="text-sm text-gray-600">{data.contacts.regularVet.address}</p>
            <p className="text-gray-700">{data.contacts.regularVet.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-800">Emergency Vet</h3>
            <p className="text-sm font-medium">{data.contacts.emergencyVet.name}</p>
            <p className="text-sm text-gray-600">{data.contacts.emergencyVet.address}</p>
            <p className="text-gray-700">{data.contacts.emergencyVet.phone}</p>
          </div>
        </div>
      </div>

      {/* Daily Tasks Reference */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold">Daily Task Reference</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {data.dailyTasks.map(task => (
            <div key={task.id} className="flex items-start gap-3 bg-white p-3 rounded-md">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-medium">{task.task}</p>
                <p className="text-sm text-gray-600">{task.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Dogs Section
  const DogsSection = () => (
    <div className="space-y-6">
      {data.dogs.map(dog => (
        <div key={dog.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{dog.photo}</span>
              <div>
                <h3 className="text-2xl font-bold">{dog.name}</h3>
                <p className="text-gray-600">{dog.age}</p>
              </div>
            </div>
            {isAdmin && (
              <button className="text-blue-600 hover:text-blue-800">
                <Edit className="w-5 h-5" />
              </button>
            )}
          </div>

          <p className="text-gray-700 mb-4">{dog.personality}</p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Feeding */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <Cookie className="w-4 h-4 text-orange-600" />
                Feeding Schedule
              </h4>
              {dog.feeding.schedule.map((item, idx) => (
                <p key={idx} className="mb-1">
                  <span className="font-medium">{item.time}:</span> {item.amount}
                </p>
              ))}
              {dog.feeding.location && (
                <p className="mt-3 text-sm">
                  <span className="font-medium">Food Location:</span> {dog.feeding.location}
                </p>
              )}
              {dog.feeding.notes && (
                <p className="text-sm text-gray-600 mt-2 italic">{dog.feeding.notes}</p>
              )}
            </div>

            {/* Medicine */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <Pill className="w-4 h-4 text-purple-600" />
                Medicine Schedule
              </h4>
              {dog.medicine.schedule.map((item, idx) => (
                <p key={idx} className="mb-1">
                  <span className="font-medium">{item.time}:</span> {item.medication}
                </p>
              ))}
              {dog.medicine.notes && (
                <p className="text-sm text-gray-600 mt-2 italic">{dog.medicine.notes}</p>
              )}
            </div>

            {/* Potty */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <Droplets className="w-4 h-4 text-blue-600" />
                Potty Training
              </h4>
              <p className="text-sm">{dog.potty.trained}</p>
              {dog.potty.notes && (
                <p className="text-sm text-gray-600 mt-2 italic">{dog.potty.notes}</p>
              )}
            </div>

            {/* Walks */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-green-600" />
                Exercise & Walks
              </h4>
              <p className="text-sm">{dog.walks.frequency}</p>
              {dog.walks.notes && (
                <p className="text-sm text-gray-600 mt-2 italic">{dog.walks.notes}</p>
              )}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Special Instructions</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">When leaving house:</span> {dog.special.whenLeaving}</p>
              {dog.special.management && (
                <p><span className="font-medium">Daily management:</span> {dog.special.management}</p>
              )}
              <p><span className="font-medium">Sleeping:</span> {dog.sleeping.location}</p>
              {dog.sleeping.notes && (
                <p className="text-gray-600 italic">{dog.sleeping.notes}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Pet House Rules */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-bold mb-4">General Pet House Rules</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium mb-1">Toys</p>
            <p className="text-gray-700">Bottom drawer in laundry room</p>
          </div>
          <div>
            <p className="font-medium mb-1">Water Bowls</p>
            <p className="text-gray-700">Main: dining room, Also: outside & office</p>
          </div>
          <div>
            <p className="font-medium mb-1">Accidents</p>
            <p className="text-gray-700">If on patio, rinse with water. Use baby wipes as needed.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // House Instructions Section
  const HouseSection = () => (
    <div className="space-y-6">
      {/* Access & Security */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-gray-600" />
          Access & Security
        </h3>
        <div className="space-y-3">
          <div>
            <p className="font-medium">Mud Room Door</p>
            <p className="text-sm text-gray-700">{data.houseInstructions.access.mudRoom}</p>
          </div>
          <div>
            <p className="font-medium">Patio Door</p>
            <p className="text-sm text-gray-700">{data.houseInstructions.access.patioDoor}</p>
          </div>
        </div>
      </div>

      {/* Entertainment */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Tv className="w-5 h-5 text-gray-600" />
          Entertainment Systems
        </h3>
        <div className="space-y-3">
          <div>
            <p className="font-medium flex items-center gap-2">
              <Tv className="w-4 h-4" /> Living Room TV
            </p>
            <p className="text-sm text-gray-700">{data.houseInstructions.entertainment.tv}</p>
          </div>
          <div>
            <p className="font-medium flex items-center gap-2">
              <Volume2 className="w-4 h-4" /> Sonos Speakers
            </p>
            <p className="text-sm text-gray-700">{data.houseInstructions.entertainment.sonos}</p>
          </div>
        </div>
      </div>

      {/* Utilities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          Home Systems
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium mb-1">Lights</p>
            <p className="text-sm text-gray-700">{data.houseInstructions.utilities.lights}</p>
          </div>
          <div>
            <p className="font-medium mb-1">Thermostat</p>
            <p className="text-sm text-gray-700">{data.houseInstructions.utilities.thermostat}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-md">
            <p className="font-medium mb-1 text-yellow-800">⚠️ Septic System</p>
            <p className="text-sm text-yellow-700">{data.houseInstructions.utilities.septic}</p>
          </div>
          <div>
            <p className="font-medium mb-1">Bathroom</p>
            <p className="text-sm text-gray-700">{data.houseInstructions.utilities.bathroom}</p>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-gray-600" />
          Amenities
        </h3>
        <div className="space-y-3">
          <div>
            <p className="font-medium flex items-center gap-2">
              <Bath className="w-4 h-4" /> Hot Tub
            </p>
            <p className="text-sm text-gray-700">{data.houseInstructions.amenities.hotTub}</p>
          </div>
          <div>
            <p className="font-medium flex items-center gap-2">
              <Trash className="w-4 h-4" /> Trash Collection
            </p>
            <p className="text-sm text-gray-700">{data.houseInstructions.amenities.trash}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Service People Section
  const ServicesSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Scheduled Service Visits</h3>
        <div className="space-y-4">
          {data.servicePeople.map(service => (
            <div key={service.id} className={`border rounded-lg p-4 ${
              service.payment !== 'Pre-paid' ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg">{service.name}</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">When:</span> {service.day} {service.time && `at ${service.time}`}
                  </p>
                  {service.payment !== 'Pre-paid' && (
                    <p className="text-sm font-bold text-orange-700 mt-2 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Payment Required: {service.payment}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 mt-1">{service.notes}</p>
                </div>
                {service.needsAccess && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                    Needs Access
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-bold mb-3">Service Contact Information</h4>
        <div className="space-y-2">
          {data.contacts.services.map((service, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="font-medium">{service.name}</span>
              <span className="text-gray-600">{service.phone}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Schedule Section
  const ScheduleSection = () => {
    const today = new Date();
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return (
      <div className="space-y-6">
        {/* Appointments */}
        {data.appointments.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-6 h-6 text-yellow-700" />
              <h2 className="text-xl font-bold text-yellow-800">Upcoming Appointments</h2>
            </div>
            {data.appointments.map(apt => (
              <div key={apt.id} className="bg-white rounded p-4 mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{apt.date} at {apt.time}</p>
                    <p className="font-medium text-gray-700">{apt.type} - {apt.who}</p>
                    <p className="text-sm text-gray-600 mt-1">{apt.notes}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">
                    {apt.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Weekly Schedule */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Weekly Schedule</h3>
          <div className="grid gap-4">
            {weekDays.map(day => {
              const hasService = data.servicePeople.some(s => s.day.includes(day));
              const hasTrash = day === 'Sunday' || day === 'Monday';
              
              return (
                <div key={day} className={`border rounded-lg p-3 ${
                  hasService || hasTrash ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                }`}>
                  <h4 className="font-bold">{day}</h4>
                  {hasTrash && day === 'Sunday' && (
                    <p className="text-sm text-blue-700 mt-1">
                      <Trash className="w-3 h-3 inline mr-1" />
                      Put trash bins out tonight
                    </p>
                  )}
                  {hasTrash && day === 'Monday' && (
                    <p className="text-sm text-blue-700 mt-1">
                      <Trash className="w-3 h-3 inline mr-1" />
                      Trash pickup (early AM) - Return bins
                    </p>
                  )}
                  {hasService && data.servicePeople.filter(s => s.day.includes(day)).map(service => (
                    <p key={service.id} className="text-sm text-blue-700 mt-1">
                      <Users className="w-3 h-3 inline mr-1" />
                      {service.name} {service.payment !== 'Pre-paid' && `($${service.payment})`}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Routine */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Daily Routine</h3>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-800">Morning (7:00 AM)</p>
              <ul className="text-sm text-gray-700 mt-1 space-y-1">
                <li>• Feed dogs & give morning medicine</li>
                <li>• Let dogs out for potty</li>
                <li>• Refill water bowls</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-800">Afternoon</p>
              <ul className="text-sm text-gray-700 mt-1 space-y-1">
                <li>• Walk Barolo</li>
                <li>• Potty breaks as needed</li>
                <li>• Wipe Barolo's head</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-800">Evening (6:00 PM)</p>
              <ul className="text-sm text-gray-700 mt-1 space-y-1">
                <li>• Feed dogs & give evening medicine</li>
                <li>• Final potty breaks</li>
                <li>• Check patio door is locked</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the active section
  const renderSection = () => {
    switch(activeSection) {
      case 'overview': return <OverviewSection />;
      case 'dogs': return <DogsSection />;
      case 'house': return <HouseSection />;
      case 'services': return <ServicesSection />;
      case 'schedule': return <ScheduleSection />;
      default: return <OverviewSection />;
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto p-4 pb-8">
        {renderSection()}
      </div>
    </div>
  );
}
