import Link from "next/link";
import Image from "next/image";
export default function NoBusiness() {
  return (
    <div className="no_businesses_container">
      <div className="logo">
        <Image
          src="/img/logo.png"
          alt="Zimbabwhere Logo"
          width={120}
          height={40}
        />
      </div>
      <div className="no_business_inner">
        <div className="intro">
          <h3>Lets get you Started!</h3>

          <p>
            Add your business or multiple businesses to start connecting with
            customers and receiving quotes through the free Advertising Section!
          </p>
          <div className="btn_group">
            <Link href="/add-a-business" className="btn btn-blue">
              Add Your First Business
            </Link>
          </div>
        </div>

        <div className="outro">
          <h3>DON'T WANT TO ADVERTISE?</h3>
          <p>
            but still want to receive quotes for services you provide? That's
            fine…
          </p>
          <p>Select our INDEPENDENT Section for your 3 free headings</p>
          <div className="btn_group">
            <Link
              href="/my-account/manage/notifications"
              className="btn btn-green"
            >
              Add as Independent
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
