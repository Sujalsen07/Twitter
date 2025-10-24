import React, { SVGProps } from 'react';

interface TwitterlogoProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string; // optional fallback
  className?: string;
  title?: string | null;
}

const Twitterlogo: React.FC<TwitterlogoProps> = ({
  size = 24,
  color,
  className = '',
  title = 'Twitter X logo',
  ...props
}) => {
  const ariaHidden = !title;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden={ariaHidden}
      {...props}
    >
      {title && <title>{title}</title>}
      <path
        fill={color || 'currentColor'} // <-- Use currentColor for Tailwind classes
        d="M18.244 2H21.5l-7.61 8.69L22 22h-6.766l-5.3-6.907L4.9 22H1.64l8.15-9.3L2 2h6.83l4.78 6.22L18.244 2zM17.07 20.14h1.88L7.05 3.8H5.05l12.02 16.34z"
      />
    </svg>
  );
};

export default Twitterlogo;
