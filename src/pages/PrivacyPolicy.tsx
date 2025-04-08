
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Josh Rader - Commercial Real Estate Agent</title>
        <meta name="description" content="Privacy Policy for Josh Rader Commercial Real Estate. Learn how we collect, use, and protect your information." />
      </Helmet>
      
      <div className="min-h-screen bg-luxury-black">
        <Navbar />
        
        <main className="container py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto bg-luxury-black p-6 md:p-10 rounded-md border border-luxury-khaki/10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E5799] mb-8">Privacy Policy</h1>
            
            <div className="prose prose-invert max-w-none space-y-6 text-white">
              <p className="text-lg">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              
              <section className="mt-8">
                <h2 className="text-2xl font-semibold text-[#1E5799] mb-4">Introduction</h2>
                <p>
                  Josh Rader Commercial Real Estate ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website joshrader.com, including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the "Site").
                </p>
                <p>
                  Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Site.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-[#1E5799] mb-4">Collection of Your Information</h2>
                <p>
                  We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                </p>
                
                <h3 className="text-xl font-semibold text-[#1E5799] mt-6 mb-2">Personal Data</h3>
                <p>
                  Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you fill out forms or data fields on our Site. This includes information provided when you:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact us through our contact form</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Request information about properties</li>
                  <li>Create an account (if applicable)</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-[#1E5799] mt-6 mb-2">Derivative Data</h3>
                <p>
                  Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-[#1E5799] mb-4">Use of Your Information</h2>
                <p>
                  Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Respond to your inquiries and fulfill your requests</li>
                  <li>Send you property information that may be of interest to you</li>
                  <li>Send administrative information, such as updates, security alerts, and support messages</li>
                  <li>Improve our website and marketing efforts</li>
                  <li>Analyze website usage and trends</li>
                  <li>Notify you of updates to our website</li>
                  <li>Generate a personal profile about you to make future interactions with our website more personalized</li>
                  <li>Compile anonymous statistical data for use internally or with third parties</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-[#1E5799] mb-4">Disclosure of Your Information</h2>
                <p>
                  We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                </p>
                
                <h3 className="text-xl font-semibold text-[#1E5799] mt-6 mb-2">By Law or to Protect Rights</h3>
                <p>
                  If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
                </p>
                
                <h3 className="text-xl font-semibold text-[#1E5799] mt-6 mb-2">Business Partners</h3>
                <p>
                  We may share your information with business partners to offer you certain products, services, or promotions that may be of interest to you related to commercial real estate in Abilene, Texas.
                </p>
                
                <h3 className="text-xl font-semibold text-[#1E5799] mt-6 mb-2">Third-Party Service Providers</h3>
                <p>
                  We may share your information with third-party service providers who perform services on our behalf, including payment processing, email delivery, hosting services, and customer service.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-[#1E5799] mb-4">Security of Your Information</h2>
                <p>
                  We use administrative, technical, and physical security measures to help protect your personal information from unauthorized access, use, or disclosure. We secure your personal information from unauthorized access, use, or disclosure using industry-standard methods, including Secure Socket Layer (SSL) technology and secure database infrastructure.
                </p>
                <p>
                  However, please also understand that no method of transmission over the internet or method of electronic storage is 100% secure and we cannot guarantee the absolute security of your data.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-[#1E5799] mb-4">Cookies and Web Beacons</h2>
                <p>
                  We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-[#1E5799] mb-4">Third-Party Websites</h2>
                <p>
                  The Site may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the Site, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information. Before visiting and providing any information to any third-party websites, you should inform yourself of the privacy policies and practices (if any) of the third party responsible for that website, and should take those steps necessary to, in your discretion, protect the privacy of your information.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-[#1E5799] mb-4">Your Rights Regarding Your Information</h2>
                <h3 className="text-xl font-semibold text-[#1E5799] mt-6 mb-2">Access and Correction</h3>
                <p>
                  You have the right to request access to the personal information we collect from you, change that information, or delete it. To request access to, correction, amendment, or deletion of your personal information, please contact us at Josh@McCullarProperties.com.
                </p>
                
                <h3 className="text-xl font-semibold text-[#1E5799] mt-6 mb-2">Email Marketing</h3>
                <p>
                  You can unsubscribe from our marketing email list at any time by clicking on the unsubscribe link in the emails that we send or by contacting us using the details provided below. You will then be removed from the marketing email list – however, we will still need to send you service-related emails that are necessary for the administration and use of your account.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-[#1E5799] mb-4">Contact Us</h2>
                <p>
                  If you have questions or comments about this Privacy Policy, please contact us at:
                </p>
                <address className="not-italic mt-4 text-white">
                  <p>Josh Rader Commercial Real Estate</p>
                  <p>1500 Industrial Blvd, Suite 300</p>
                  <p>Abilene, TX 79601</p>
                  <p>Phone: (325) 665-9244</p>
                  <p>Email: Josh@McCullarProperties.com</p>
                </address>
              </section>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
