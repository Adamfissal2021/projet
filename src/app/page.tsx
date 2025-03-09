import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  Calculator,
  BarChart3,
  FileSpreadsheet,
  LineChart,
  PenTool,
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Powerful Math & Statistics Tools
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive tools for mathematical
              calculations and statistical analysis with real-time visualization
              capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Calculator className="w-6 h-6" />,
                title: "Advanced Equation Solver",
                description:
                  "Solve complex equations with step-by-step solutions",
              },
              {
                icon: <PenTool className="w-6 h-6" />,
                title: "Calculus Tools",
                description:
                  "Calculate derivatives and integrals with LaTeX support",
              },
              {
                icon: <LineChart className="w-6 h-6" />,
                title: "Interactive Visualizations",
                description: "Create dynamic charts that update in real-time",
              },
              {
                icon: <FileSpreadsheet className="w-6 h-6" />,
                title: "Data Import & Analysis",
                description:
                  "Upload CSV files for instant statistical analysis",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Mathematical Functions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5+</div>
              <div className="text-blue-100">Chart Types</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Accurate Results</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Perfect For</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform is designed for a wide range of users who need
              powerful mathematical and statistical tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Students</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Solve complex math problems</span>
                </li>
                <li className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Visualize functions and data</span>
                </li>
                <li className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Learn with step-by-step solutions</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Researchers</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Analyze complex datasets</span>
                </li>
                <li className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Create publication-ready charts</span>
                </li>
                <li className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Perform statistical analysis</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Professionals</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Generate reports with visualizations</span>
                </li>
                <li className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Make data-driven decisions</span>
                </li>
                <li className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Share insights with team members</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-50" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. No hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Analyze Your Data?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Start using our powerful math and statistics tools today.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started Now
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
