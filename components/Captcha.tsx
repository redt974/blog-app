import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Captcha({ onVerify }: { onVerify: (token: string | null) => void }) {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  return (
    <div className="w-full flex justify-center mt-4">
      <div className="w-full max-w-[500px] flex justify-center">
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY!}
          ref={recaptchaRef}
          onChange={onVerify}
        />
      </div>
    </div>
  );
}
