import TesterSignupForm from "@/components/tester-signup/TesterSignupForm";
import SiteSideBar from "@/components/global/Sidebar";

export const metadata = {
  title: "Become an App Tester | Zimbabwhere",
  description:
    "Help us launch the Zimbabwhere Android app. Sign up as a tester, get early access and help us get the app onto Google Play.",
  // Campaign page for people who got our email, not something to rank in search
  robots: { index: false, follow: true },
};

export default function BecomeATesterPage() {
  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main">
          <div className="page_title">
            <h1>Become an App Tester</h1>
            <p style={{ marginTop: "8px", fontSize: "14px", color: "#bbb" }}>
              Help us launch the Zimbabwhere Android app, and get to use it
              before everyone else.
            </p>
          </div>

          <section className="tester_info">
            <h2>Why we need you</h2>
            <p>
              We're getting the Zimbabwhere app ready for Google Play. Before an
              app can be released to the public, Google requires it to be tested
              by a group of real people on their own Android phones. You'd be
              one of them.
            </p>
            <p>
              It's free, it only takes a few minutes to set up, and you'll be
              helping us make the app better for every Zimbabwean business and
              customer who uses it.
            </p>

            <h2>How it works</h2>
            <ol className="tester_steps">
              <li>
                <strong>Sign up below</strong> with the email address you use on
                the Google Play Store on your Android phone.
              </li>
              <li>
                <strong>We add you to our tester group.</strong> We'll email you
                a link once you're in.
              </li>
              <li>
                <strong>Open the link on your phone</strong>, accept the
                invite, and download the app from Google Play.
              </li>
              <li>
                <strong>Use the app and keep it installed</strong> while testing
                runs. Try out the quotes, search and business listings, and
                tell us if anything is broken or confusing.
              </li>
            </ol>

            <div className="tester_note">
              <strong>Good to know</strong>
              <ul>
                <li>You need an Android phone. The app is not on iPhone yet.</li>
                <li>
                  The email must be the Google account you use on the Play
                  Store, or the invite won't work.
                </li>
                <li>
                  Testing is free and you won't be asked for any payment.
                </li>
                <li>
                  Please don't uninstall the app until we tell you testing is
                  finished, as it counts towards Google's requirement.
                </li>
              </ul>
            </div>
          </section>

          <h2 className="tester_form_title">Sign up as a tester</h2>
          <TesterSignupForm />
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
