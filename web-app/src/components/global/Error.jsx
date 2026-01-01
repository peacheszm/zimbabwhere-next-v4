import { IconExclamationCircle } from "@tabler/icons-react";

export default function ErrorMessage({ body }) {
  return (
    <div className="message_notice error">
      <div className="icon">
        <IconExclamationCircle />
      </div>
      <div className="message_body_wrapper">
        <div className="message_title">Error</div>
        <div className="message_body">{body}</div>
        <div className="message_link"></div>
      </div>
    </div>
  );
}
