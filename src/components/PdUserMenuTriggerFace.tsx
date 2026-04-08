import { useState } from 'react';
import type { MenuTriggerAvatar } from '../logic/avatarPreference';

type Props = {
  avatar: MenuTriggerAvatar;
  className?: string;
};

export function PdUserMenuTriggerFace({ avatar, className = '' }: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  if (avatar.kind === 'photo' && !imgFailed) {
    return (
      <span className={`pd-user-menu-trigger-avatar ${className}`.trim()}>
        <img
          src={avatar.src}
          alt=""
          className="pd-user-menu-trigger-avatar-img"
          referrerPolicy="no-referrer"
          decoding="async"
          onError={() => setImgFailed(true)}
        />
      </span>
    );
  }

  const emoji = avatar.kind === 'emoji' ? avatar.emoji : '🧭';
  return (
    <span className={`pd-user-menu-trigger-avatar pd-user-menu-trigger-avatar--emoji ${className}`.trim()}>
      {emoji}
    </span>
  );
}
