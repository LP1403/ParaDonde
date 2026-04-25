import { useEffect, useState } from 'react';
import type { MenuTriggerAvatar } from '../logic/avatarPreference';
import { twemojiCdnPngUrl } from '../utils/twemojiCdnUrl';

type Props = {
  avatar: MenuTriggerAvatar;
  className?: string;
};

function avatarKey(avatar: MenuTriggerAvatar) {
  return avatar.kind === 'photo' ? avatar.src : avatar.emoji;
}

export function PdUserMenuTriggerFace({ avatar, className = '' }: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  const key = avatarKey(avatar);
  useEffect(() => {
    setImgFailed(false);
  }, [key]);

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

  if (avatar.kind === 'photo' && imgFailed) {
    return (
      <span
        className={`pd-user-menu-trigger-avatar pd-user-menu-trigger-avatar--emoji ${className}`.trim()}
        aria-hidden
      >
        ?
      </span>
    );
  }

  const emoji = avatar.kind === 'emoji' ? avatar.emoji : '🧭';
  const twUrl = twemojiCdnPngUrl(emoji);
  if (twUrl && !imgFailed) {
    return (
      <span className={`pd-user-menu-trigger-avatar ${className}`.trim()}>
        <img
          src={twUrl}
          alt=""
          className="pd-user-menu-trigger-avatar-img pd-user-menu-trigger-avatar-img--twemoji"
          referrerPolicy="no-referrer"
          decoding="async"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      </span>
    );
  }

  return (
    <span
      className={`pd-user-menu-trigger-avatar pd-user-menu-trigger-avatar--emoji ${className}`.trim()}
    >
      {emoji}
    </span>
  );
}
