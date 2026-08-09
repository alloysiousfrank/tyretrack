import { GARAGE } from '../../data/services'
import './WhatsAppButton.css'

// Floating WhatsApp button — bottom-right corner, styled in the site's
// own red/black palette (not WhatsApp's stock green) so it matches
// the rest of the site. Opens a chat with GARAGE.whatsapp directly.
export default function WhatsAppButton() {
  const digitsOnly = GARAGE.whatsapp.replace(/\D/g, '')
  const waLink = `https://wa.me/91${digitsOnly}`

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float"
      aria-label="Chat with us on WhatsApp"
    >
      <svg
        viewBox="0 0 32 32"
        width="28"
        height="28"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.386.703 4.607 1.912 6.47L4 29l7.72-1.874A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.818a9.77 9.77 0 0 1-4.98-1.362l-.357-.212-4.582 1.112 1.145-4.47-.234-.366A9.76 9.76 0 0 1 5.2 15c0-5.964 4.84-10.818 10.804-10.818S26.808 9.036 26.808 15 21.968 24.818 16.004 24.818Zm5.36-7.36c-.294-.148-1.74-.86-2.01-.957-.27-.098-.467-.148-.664.147-.196.295-.762.958-.934 1.155-.172.196-.343.221-.637.074-.294-.148-1.243-.458-2.368-1.463-.875-.78-1.466-1.744-1.638-2.038-.172-.295-.018-.454.13-.601.133-.133.294-.344.441-.516.148-.172.196-.295.294-.491.098-.197.049-.369-.025-.516-.074-.148-.664-1.6-.91-2.192-.24-.577-.484-.499-.664-.508l-.566-.01c-.196 0-.516.074-.786.369-.27.295-1.03 1.007-1.03 2.455 0 1.448 1.055 2.847 1.202 3.043.147.196 2.077 3.171 5.033 4.447.703.303 1.252.484 1.68.62.706.225 1.348.193 1.856.117.566-.085 1.74-.712 1.986-1.398.246-.687.246-1.276.172-1.398-.074-.123-.27-.196-.564-.344Z" />
      </svg>
    </a>
  )
}
