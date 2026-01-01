import { IconCircleDashedCheck } from "@tabler/icons-react";
export default function SuccessMessage({ body }) {
  return (
    <div className="message_notice success">
      <div className="icon">
        <IconCircleDashedCheck />
      </div>
      <div className="message_body_wrapper">
        <div className="message_title">Success</div>
        <div className="message_body">{body}</div>
        <div className="message_link"></div>
      </div>
    </div>
  );
}
