import { IconInfoCircle } from "@tabler/icons-react";
export default function NoticeMessage({ title, body }) {
  return (
    <div className="message_notice notice">
      <div className="icon">
        <IconInfoCircle />
      </div>
      <div className="message_body_wrapper">
        <div className="message_title">{title}</div>

        <div
          className="message_body"
          dangerouslySetInnerHTML={{ __html: body }}
        />
        <div className="message_link"></div>
      </div>
    </div>
  );
}
