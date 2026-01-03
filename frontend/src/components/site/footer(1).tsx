import { config } from "@/lib/config";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  Facebook,
  Globe,
} from "lucide-react";
import Logo from "../ui/logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <Logo />
            <p className="mt-4 text-sm text-gray-400">
              <span className="font-semibold">by Sumit Art</span> <br />
              The Art of Imagination
            </p>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-4">
              <a
                href="https://www.instagram.com/sumitartgiftshop"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>

              <a
                href="https://www.youtube.com/@sumitartgiftshop"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>

              <a
                href="https://www.facebook.com/sagarart01"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>

              <a
                href="https://visitmyprofile.in/sumit-art"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
                aria-label="Website"
              >
                <Globe size={20} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>

            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <Phone size={16} />
                <span>+91 88676 72679</span>
              </p>

              <p className="flex items-center gap-2">
                <Phone size={16} />
                <span>+91 70166 24048</span>
              </p>

              <p className="flex items-center gap-2">
                <Mail size={16} />
                <a
                  href="mailto:sumitart2018@gmail.com"
                  className="hover:text-white"
                >
                  sumitart2018@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-white font-semibold mb-4">Location</h4>

            <a
              href="https://maps.app.goo.gl/hwdGQruSz84eZ5zBA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-sm hover:text-white"
            >
              <MapPin size={16} className="mt-0.5" />
              <span>
                Near Umiya Metal Mandir, <br />
                Kathlal, Dist. Kheda, <br />
                Gujarat, India
              </span>
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-800 pt-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© {currentYear} {config.name}. All rights reserved.</p>
          <p className="  md:mt-0"></p>
        </div>
      </div>
    </footer>
  );
}
