import { IIcons } from 'interfaces/IIcons';

export const DashboardIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PropertiesIcon = ({ color = 'currentColor', width = 25, height = 24 }: IIcons) => {
  return (
    <svg width={width} height={height} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.0534 0.253C9.7862 0.34675 9.65495 0.449875 9.50964 0.665501L9.38308 0.862375L9.35964 3.79206L9.3362 6.72644L6.1487 7.69206C4.23152 8.27331 2.88152 8.70456 2.76902 8.77956C2.65183 8.84988 2.51589 8.9905 2.44089 9.12175L2.30495 9.35144L2.29089 15.5483L2.28152 21.7499H1.91589C1.29245 21.7499 0.894017 22.0311 0.776829 22.5514C0.669017 23.0296 1.01589 23.5874 1.49402 23.7093C1.65808 23.7514 4.40027 23.7655 12.5143 23.7655C24.2518 23.7655 23.5581 23.7796 23.919 23.5077C24.3034 23.2171 24.4018 22.6546 24.1487 22.2374C23.9331 21.8952 23.6237 21.7499 23.1128 21.7499H22.719V11.4843C22.719 4.09675 22.705 1.153 22.6675 0.979563C22.5971 0.651438 22.2784 0.323313 21.9596 0.243626C21.6175 0.15925 10.2925 0.168625 10.0534 0.253ZM20.7034 11.9764V21.7499H18.1487H15.594V13.8514C15.594 7.32644 15.5846 5.92488 15.5331 5.79831C15.3784 5.43269 15.0034 5.16081 14.6565 5.15613C14.5675 5.15613 13.7987 5.36706 12.9503 5.62488C12.1065 5.88269 11.394 6.09363 11.3706 6.09363C11.3471 6.09363 11.3284 5.23581 11.3284 4.14831V2.203H16.0159H20.7034V11.9764ZM13.6721 14.653V21.7499H11.8487H10.0206L10.0065 19.7905L9.99245 17.8358L9.8612 17.6108C9.51433 17.0202 8.71745 16.9358 8.26277 17.4374C8.1737 17.5358 8.07995 17.6999 8.05183 17.7983C8.01902 17.9108 8.00027 18.6796 8.00027 19.8608V21.7499H6.1487H4.29714L4.30652 16.0218L4.32058 10.2936L8.9612 8.90613C11.5159 8.13738 13.6159 7.52331 13.6393 7.53269C13.6581 7.54206 13.6721 10.7483 13.6721 14.653Z"
        fill={color}
      />
    </svg>
  );
};

export const MaintenanceIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.7001 6.30022C13.5169 6.48715 13.4142 6.73847 13.4142 7.00022C13.4142 7.26198 13.5169 7.5133 13.7001 7.70022L15.3001 9.30022C15.487 9.48345 15.7383 9.58608 16.0001 9.58608C16.2619 9.58608 16.5132 9.48345 16.7001 9.30022L20.4701 5.53022C20.9729 6.64141 21.1252 7.87946 20.9066 9.07937C20.6879 10.2793 20.1088 11.3841 19.2464 12.2465C18.3839 13.1089 17.2792 13.6881 16.0792 13.9067C14.8793 14.1253 13.6413 13.9731 12.5301 13.4702L5.6201 20.3802C5.22227 20.778 4.68271 21.0015 4.1201 21.0015C3.55749 21.0015 3.01792 20.778 2.6201 20.3802C2.22227 19.9824 1.99878 19.4428 1.99878 18.8802C1.99878 18.3176 2.22227 17.778 2.6201 17.3802L9.5301 10.4702C9.02726 9.35904 8.87502 8.12099 9.09364 6.92108C9.31227 5.72117 9.89139 4.61638 10.7538 3.75395C11.6163 2.89151 12.721 2.31239 13.921 2.09377C15.1209 1.87514 16.3589 2.02739 17.4701 2.53022L13.7101 6.29022L13.7001 6.30022Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CalendarIcon = ({ color = 'currentColor', size = '24' }: IIcons) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 10H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const AccountsIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PeoplesIcon = ({ color = 'currentColor', width = 24, height = 24 }: IIcons) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23 21.0028V19.0028C22.9993 18.1165 22.7044 17.2556 22.1614 16.5551C21.6184 15.8547 20.8581 15.3544 20 15.1328"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 3.13281C16.8604 3.35311 17.623 3.85351 18.1676 4.55512C18.7122 5.25673 19.0078 6.11964 19.0078 7.00781C19.0078 7.89598 18.7122 8.75889 18.1676 9.4605C17.623 10.1621 16.8604 10.6625 16 10.8828"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SearchIcon = ({ color = 'currentColor', size = '24px' }: IIcons) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const LogoutIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 17L21 12L16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ArrowBack = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 8L8 12L12 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 12H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const HelpIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.09003 8.99996C9.32513 8.33163 9.78918 7.76807 10.4 7.40909C11.0108 7.05012 11.7289 6.9189 12.4272 7.03867C13.1255 7.15844 13.7588 7.52148 14.2151 8.06349C14.6714 8.60549 14.9211 9.29148 14.92 9.99996C14.92 12 11.92 13 11.92 13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 17H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ReportIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 13H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 9H9H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const SendIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DownloadIcon = ({ color = 'currentColor', size = '24' }: IIcons) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7 10L12 15L17 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const DollarIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1V23" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const FilterIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.3333 2.5H1.66666L8.33332 10.3833V15.8333L11.6667 17.5V10.3833L18.3333 2.5Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ChevronUpIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.6829 8.90247L7.12196 5.34149L3.56099 8.90247"
        stroke={color}
        strokeWidth="1.18699"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ChevronDownIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.56097 5.43091L7.12195 8.99188L10.6829 5.43091"
        stroke={color}
        strokeWidth="1.18699"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ChevronLeftIcon = ({ size = '15', color = 'currentColor' }: IIcons) => {
  return (
    <svg width={size} height={size} viewBox="-1 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1L1 8L8 15" stroke={color} strokeWidth="1.18699" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ChevronRightIcon = ({ size = '15', color = 'currentColor' }: IIcons) => {
  return (
    <svg width={size} height={size} viewBox="-4 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L8 8L1 15" stroke={color} strokeWidth="1.18699" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const VacantIcon = () => {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.5" cy="7.5" r="7.10526" stroke="#E4E4E4" strokeWidth="0.789474" />
      <path
        d="M7.5 0C6.51509 -1.1745e-08 5.53982 0.193993 4.62987 0.570903C3.71993 0.947814 2.89314 1.50026 2.1967 2.1967C1.50026 2.89314 0.947814 3.71993 0.570903 4.62987C0.193993 5.53982 -3.1307e-08 6.51509 0 7.5C3.1307e-08 8.48491 0.193993 9.46018 0.570904 10.3701C0.947814 11.2801 1.50026 12.1069 2.1967 12.8033C2.89314 13.4997 3.71993 14.0522 4.62987 14.4291C5.53982 14.806 6.51509 15 7.5 15L7.5 7.5V0Z"
        fill="#CFCFCF"
      />
    </svg>
  );
};

export const OccupiedIcon = () => {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.5" cy="7.5" r="7.5" fill="#4BB11B" />
    </svg>
  );
};

export const DotIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="3" cy="3" r="3" fill={color} />
    </svg>
  );
};

export const CloseIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 1L1 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const TrashIcon = ({ color = 'currentColor', size = '16' }: IIcons) => {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M2 4H3.33333H14" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5.33337 4.00016V2.66683C5.33337 2.31321 5.47385 1.97407 5.7239 1.72402C5.97395 1.47397 6.31309 1.3335 6.66671 1.3335H9.33337C9.687 1.3335 10.0261 1.47397 10.2762 1.72402C10.5262 1.97407 10.6667 2.31321 10.6667 2.66683V4.00016M12.6667 4.00016V13.3335C12.6667 13.6871 12.5262 14.0263 12.2762 14.2763C12.0261 14.5264 11.687 14.6668 11.3334 14.6668H4.66671C4.31309 14.6668 3.97395 14.5264 3.7239 14.2763C3.47385 14.0263 3.33337 13.6871 3.33337 13.3335V4.00016H12.6667Z"
        stroke={color}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const EditIcon = ({ color = 'currentColor', size = '14' }: IIcons) => {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path
        d="M9.91663 1.75009C10.0698 1.59689 10.2517 1.47535 10.4519 1.39244C10.6521 1.30952 10.8666 1.26685 11.0833 1.26685C11.3 1.26685 11.5145 1.30952 11.7147 1.39244C11.9149 1.47535 12.0968 1.59689 12.25 1.75009C12.4032 1.9033 12.5247 2.08519 12.6076 2.28537C12.6905 2.48554 12.7332 2.70009 12.7332 2.91676C12.7332 3.13343 12.6905 3.34798 12.6076 3.54816C12.5247 3.74833 12.4032 3.93022 12.25 4.08343L4.37496 11.9584L1.16663 12.8334L2.04163 9.62509L9.91663 1.75009Z"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const BedIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="20" height="20" viewBox="0 0 25 15" fill="none">
      <path
        d="M2.46548 0.31689C2.10415 0.409663 1.82583 0.644038 1.66469 1.00537C1.56704 1.22021 1.56215 1.31298 1.56215 3.96435V6.69872L1.37661 6.78662C0.888327 7.02099 0.346335 7.50439 0.136374 7.8999L0.0240689 8.10986L0.00942045 11.0981C-0.00522799 14.4185 -0.0149936 14.3061 0.317038 14.5601C0.483053 14.687 0.541647 14.7017 0.9811 14.7163C1.64516 14.7456 1.86977 14.7017 2.07973 14.5161C2.29458 14.3306 2.31899 14.2622 2.46548 13.564C2.5436 13.1587 2.60708 12.978 2.69008 12.8901L2.79751 12.7729H12.4997H22.2018L22.3092 12.8901C22.3922 12.978 22.4557 13.1587 22.5338 13.564C22.6803 14.2622 22.7047 14.3306 22.9196 14.5161C23.1295 14.7017 23.3541 14.7456 24.0182 14.7163C24.4577 14.7017 24.5163 14.687 24.6823 14.5601C25.0143 14.3061 25.0045 14.4185 24.9899 11.0981L24.9752 8.10986L24.8629 7.8999C24.653 7.50439 24.111 7.02099 23.6227 6.78662L23.4372 6.69872V3.96435C23.4372 1.31298 23.4323 1.22021 23.3346 1.00537C23.2125 0.736812 23.0319 0.541499 22.778 0.40478L22.5827 0.297359L12.5973 0.287593C7.10415 0.287593 2.54848 0.297359 2.46548 0.31689ZM22.568 1.14209L22.6803 1.25439L22.695 3.81298L22.7096 6.37158L22.3043 6.23486C22.0797 6.16162 21.6696 6.03955 21.3864 5.96142C21.1032 5.8833 20.8688 5.81982 20.859 5.81494C20.8541 5.81005 20.8981 5.69775 20.9567 5.56591C21.0592 5.34619 21.069 5.2583 21.069 4.39892C21.069 3.31494 21.025 3.13916 20.6588 2.74853C20.3952 2.46533 20.1852 2.35302 19.7995 2.27978C19.4235 2.21142 13.7887 2.20654 13.4225 2.2749C13.1198 2.33349 12.8219 2.47509 12.6364 2.65576L12.4997 2.78271L12.3678 2.65576C12.1774 2.47509 11.8795 2.33349 11.5768 2.2749C11.2106 2.20654 5.57583 2.21142 5.19985 2.27978C4.81411 2.35302 4.60415 2.46533 4.34048 2.74853C3.97426 3.13916 3.93032 3.31494 3.93032 4.39892C3.93032 5.2583 3.94008 5.34619 4.04262 5.56591C4.10122 5.69775 4.14516 5.81005 4.14028 5.81494C4.13051 5.81982 3.89614 5.8833 3.61294 5.96142C3.32973 6.03955 2.91958 6.16162 2.69985 6.23486L2.29458 6.37158V3.87158C2.29458 1.20068 2.29458 1.19091 2.53872 1.06884C2.63637 1.02001 4.68227 1.01025 12.5582 1.02001L22.4557 1.02978L22.568 1.14209ZM11.7184 3.08544C11.8112 3.13916 11.9381 3.25634 11.9967 3.34912C12.0993 3.4956 12.109 3.56396 12.109 4.22802C12.109 4.84326 12.0993 4.95556 12.0309 4.97997C11.987 4.99462 11.6403 5.00927 11.2497 5.00927C9.87758 5.00927 7.23598 5.24853 5.68813 5.51708C4.91176 5.64892 4.902 5.64892 4.7311 5.27783C4.65786 5.12158 4.63833 4.95556 4.63833 4.41845C4.63833 3.60302 4.65786 3.4956 4.85317 3.27587C5.13149 2.95361 5.05825 2.95849 8.47133 2.97314C11.4743 2.98291 11.5524 2.98291 11.7184 3.08544ZM19.9069 3.06591C19.9948 3.11474 20.1266 3.23193 20.1999 3.33447C20.3317 3.51025 20.3366 3.5249 20.3512 4.26709C20.3707 5.08251 20.3219 5.33154 20.1022 5.53662L19.9948 5.63427L19.3112 5.51708C17.7682 5.24853 15.1217 5.00927 13.7497 5.00927C13.359 5.00927 13.0124 4.99462 12.9684 4.97997C12.9 4.95556 12.8903 4.84326 12.8903 4.24267C12.8903 3.50537 12.9196 3.37353 13.1247 3.18798C13.3737 2.96337 13.4176 2.95849 16.6745 2.97314C19.4967 2.98291 19.7653 2.98779 19.9069 3.06591ZM13.7692 5.74169C16.3766 5.81982 18.2956 6.0249 20.1803 6.42529C22.3385 6.88427 23.8864 7.57275 24.1891 8.20263C24.2526 8.33447 24.2672 8.53955 24.2672 9.22802V10.0874H23.2077C22.1872 10.0874 22.1432 10.0923 22.0358 10.1948C21.8356 10.3804 21.9088 10.6733 22.1725 10.7661C22.2653 10.8003 22.7145 10.8198 23.2956 10.8198H24.2672V12.4067V13.9985L23.818 13.9839L23.3688 13.9692L23.2663 13.4565C23.0905 12.5874 22.9782 12.3823 22.5485 12.1675L22.2946 12.0405H12.4997H2.70473L2.45083 12.1675C2.02114 12.3823 1.90883 12.5874 1.73305 13.4565L1.63051 13.9692L1.1813 13.9839L0.732077 13.9985V12.4067V10.8198L10.7956 10.8101L20.859 10.7954L20.9762 10.6587C21.1178 10.4927 21.1227 10.3852 20.9909 10.2143L20.8932 10.0874H10.8102H0.732077V9.22802C0.732077 8.26122 0.756491 8.15869 1.07387 7.8706C2.31899 6.74755 6.34243 5.88818 11.0104 5.74658C11.6549 5.72705 12.2165 5.70751 12.2555 5.70263C12.2946 5.69775 12.9782 5.71728 13.7692 5.74169Z"
        fill={color}
      />
    </svg>
  );
};

export const BathroomIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="18" height="18" viewBox="0 0 23 23" fill="none">
      <path
        d="M6.37813 0.531446C4.9002 0.778517 3.75469 1.83418 3.41328 3.2582C3.32793 3.6041 3.32344 3.81973 3.32344 8.19063V12.7637H1.76914H0.214844L0.237305 15.3781C0.259766 18.1678 0.264258 18.2441 0.497852 18.9629C0.632617 19.3762 0.996484 20.0725 1.25703 20.4139C1.86348 21.218 2.75293 21.8738 3.64238 22.1748C4.28027 22.3949 4.77441 22.4668 5.60996 22.4668H6.37813V22.9834V23.5H6.89473H7.41133V22.9834V22.4668L11.4902 22.4758L15.5646 22.4893L15.5781 22.9924L15.5916 23.5H16.0813H16.5709L16.5844 22.9924L16.5979 22.4893L17.4738 22.4623C18.4307 22.4354 18.817 22.3725 19.3965 22.1479C21.1484 21.4785 22.3883 19.9467 22.6623 18.1229C22.7162 17.777 22.7297 17.1615 22.7297 15.2209V12.7637H13.5207H4.30723L4.3207 8.19063L4.33418 3.62207L4.4375 3.33008C4.70703 2.54395 5.2416 1.97793 6.00527 1.68145C6.27031 1.57812 6.37813 1.56016 6.84981 1.56016C7.46523 1.55566 7.74375 1.62305 8.17949 1.88809C8.88477 2.31934 9.34297 3.03359 9.41934 3.8332L9.44629 4.1252L9.24863 4.15664C8.20195 4.31387 7.08789 5.22578 6.66113 6.25899C6.44551 6.78906 6.41406 6.95977 6.3916 7.83125L6.36914 8.67578H9.94942H13.5297L13.5072 7.83125C13.4848 6.95977 13.4533 6.78906 13.2377 6.25899C12.9727 5.6166 12.3977 4.95625 11.7688 4.5834C11.4453 4.39023 10.7715 4.13867 10.5828 4.13867C10.484 4.13867 10.475 4.11621 10.448 3.80176C10.2998 2.1666 9.13184 0.872852 7.52363 0.567383C7.20469 0.504492 6.63867 0.486525 6.37813 0.531446ZM10.6906 5.2168C11.6609 5.49981 12.483 6.52402 12.4875 7.44942V7.64258H9.94942H7.41133V7.47188C7.41133 7.01816 7.68535 6.3668 8.05371 5.95352C8.71406 5.2168 9.72031 4.93379 10.6906 5.2168ZM21.6875 15.9396L21.6695 18.0869L21.5482 18.4912C21.2967 19.2953 20.8205 20.023 20.2275 20.4992C19.8143 20.8271 19.6301 20.9395 19.1809 21.1326C18.4217 21.4516 18.8484 21.4381 11.3195 21.4246L4.55879 21.4111L4.17695 21.2809C2.74395 20.8002 1.78262 19.7895 1.37832 18.3385C1.28848 18.0195 1.28398 17.8713 1.26602 15.8947L1.25254 13.7969H11.4768H21.701L21.6875 15.9396Z"
        fill={color}
      />
    </svg>
  );
};

export const FileIcon = ({ color = 'currentColor', size = '24' }: IIcons) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 2V9H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ReturnIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <path
        d="M7.12508 7.9165L3.16675 11.8748L7.12508 15.8332"
        stroke={color}
        strokeWidth="1.58333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8334 3.1665V8.70817C15.8334 9.54802 15.4998 10.3535 14.9059 10.9473C14.3121 11.5412 13.5066 11.8748 12.6667 11.8748H3.16675"
        stroke={color}
        strokeWidth="1.58333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ArrowLeft = ({ color = 'currentColor', size = '22' }: IIcons) => {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path
        d="M11 19.3332L2.66667 10.9998L11 2.6665"
        stroke={color}
        strokeWidth="4.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M19.3334 11H2.66671" stroke={color} strokeWidth="4.16667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ArrowRight = ({ color = 'currentColor', size = '22' }: IIcons) => {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path
        d="M11 19.3332L19.3333 10.9998L11 2.6665"
        stroke={color}
        strokeWidth="4.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2.66699 11H19.3337" stroke={color} strokeWidth="4.16667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const AttachmentIcon = ({ color = 'currentColor', size = '18' }: IIcons) => {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path
        d="M16.0802 8.29354L9.18772 15.186C8.34333 16.0304 7.19811 16.5048 6.00397 16.5048C4.80983 16.5048 3.6646 16.0304 2.82022 15.186C1.97583 14.3417 1.50146 13.1964 1.50146 12.0023C1.50146 10.8082 1.97583 9.66293 2.82022 8.81854L9.71272 1.92604C10.2756 1.36312 11.0391 1.04687 11.8352 1.04688C12.6313 1.04688 13.3948 1.36312 13.9577 1.92604C14.5206 2.48897 14.8369 3.25245 14.8369 4.04854C14.8369 4.84463 14.5206 5.60812 13.9577 6.17104L7.05772 13.0635C6.77626 13.345 6.39451 13.5031 5.99647 13.5031C5.59842 13.5031 5.21668 13.345 4.93522 13.0635C4.65376 12.7821 4.49563 12.4003 4.49563 12.0023C4.49563 11.6042 4.65376 11.2225 4.93522 10.941L11.3027 4.58104"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const UsersPlusIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M20 8V14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 11H17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const StepClearIcon = () => {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <circle cx="9.5" cy="9.5" r="9.5" fill="#189915" />
      <path
        d="M14.6667 6L7.33333 13.3333L4 10"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const GearIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#clip0_1357_589)">
        <path
          d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15V15Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const PhoneIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.3334 14.0994V16.5994C18.3344 16.8315 18.2868 17.0612 18.1939 17.2739C18.1009 17.4865 17.9645 17.6774 17.7935 17.8343C17.6225 17.9912 17.4206 18.1107 17.2007 18.185C16.9809 18.2594 16.7479 18.287 16.5168 18.2661C13.9525 17.9875 11.4893 17.1112 9.32511 15.7078C7.31163 14.4283 5.60455 12.7212 4.32511 10.7078C2.91676 8.53377 2.04031 6.05859 1.76677 3.48276C1.74595 3.25232 1.77334 3.02006 1.84719 2.80078C1.92105 2.5815 2.03975 2.38 2.19575 2.20911C2.35174 2.03822 2.54161 1.90169 2.75327 1.8082C2.96492 1.71471 3.19372 1.66631 3.42511 1.6661H5.92511C6.32953 1.66212 6.7216 1.80533 7.02824 2.06904C7.33488 2.33275 7.53517 2.69897 7.59177 3.09943C7.69729 3.89949 7.89298 4.68504 8.17511 5.4411C8.28723 5.73937 8.31149 6.06353 8.24503 6.37516C8.17857 6.6868 8.02416 6.97286 7.80011 7.19943L6.74177 8.25776C7.92807 10.3441 9.65549 12.0715 11.7418 13.2578L12.8001 12.1994C13.0267 11.9754 13.3127 11.821 13.6244 11.7545C13.936 11.688 14.2602 11.7123 14.5584 11.8244C15.3145 12.1066 16.1001 12.3022 16.9001 12.4078C17.3049 12.4649 17.6746 12.6688 17.9389 12.9807C18.2032 13.2926 18.3436 13.6907 18.3334 14.0994Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const EmailIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.33329 3.33398H16.6666C17.5833 3.33398 18.3333 4.08398 18.3333 5.00065V15.0007C18.3333 15.9173 17.5833 16.6673 16.6666 16.6673H3.33329C2.41663 16.6673 1.66663 15.9173 1.66663 15.0007V5.00065C1.66663 4.08398 2.41663 3.33398 3.33329 3.33398Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 5L9.99996 10.8333L1.66663 5"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const FlagIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3C20 3 19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3V15Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 22V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const RecurringIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.75 0.75L15.75 3.75L12.75 6.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.25 8.25V6.75C2.25 5.95435 2.56607 5.19129 3.12868 4.62868C3.69129 4.06607 4.45435 3.75 5.25 3.75H15.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.25 17.25L2.25 14.25L5.25 11.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 9.75V11.25C15.75 12.0456 15.4339 12.8087 14.8713 13.3713C14.3087 13.9339 13.5456 14.25 12.75 14.25H2.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const MoreHIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const AddIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 8V16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ArrowBottom = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 7L7 0.999999L1 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ExportIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.0673 14.7812V18.5067C18.0673 19.0008 17.8883 19.4746 17.5697 19.8239C17.2512 20.1732 16.8191 20.3695 16.3686 20.3695H4.47753C4.027 20.3695 3.59492 20.1732 3.27635 19.8239C2.95778 19.4746 2.77881 19.0008 2.77881 18.5067V14.7812"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.17627 10.1328L10.4231 14.7897L14.6699 10.1328"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.4233 14.7858V3.60938"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const NewTabIcon = ({ color = 'currentColor', width = 22, height = 22 }: IIcons) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 1000 1000">
      <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
        <path
          fill={color}
          d="M2921.9,4981.1c-216.4-57.4-408.5-220.8-499.1-424c-35.3-75.1-42-185.5-50.8-947.4l-11-861.3l-861.3-11c-819.3-11-865.7-13.3-960.6-57.4c-159-75.1-278.3-194.3-357.8-357.7l-72.9-148l-6.6-3146.9c-4.4-3142.5-4.4-3146.9,42-3299.3c39.7-132.5,66.3-172.2,183.3-291.5c119.2-117.1,159-143.5,291.5-183.3c152.4-46.4,156.8-46.4,3299.3-41.9l3146.9,6.6l148,72.9c163.4,79.5,282.7,198.8,357.8,357.8c44.2,95,46.4,141.3,57.4,960.6l11,861.3l861.3,11c819.3,11,865.7,13.3,960.6,57.4c159,75.1,278.3,194.3,357.8,357.7l72.9,148l6.6,3146.9c4.4,3142.5,4.4,3146.9-41.9,3299.3c-39.8,132.5-66.3,172.3-183.3,291.5c-117,114.8-161.2,143.5-287.1,183.3c-150.2,46.4-161.2,46.4-3257.3,44.2C3741.2,5009.8,2999.2,5003.2,2921.9,4981.1z M9151.7,1246.8v-3014.4H6137.3H3122.9v3014.4v3014.4h3014.4h3014.4V1246.8z M2372,16.7v-1972.1l64-132.5c75.1-156.8,192.1-280.5,344.5-360l110.4-59.6l1992-6.6l1994.2-4.4v-761.9v-761.9H3862.7H848.3v3014.4v3014.4h761.9H2372V16.7z"
        />
        <path
          fill={color}
          d="M5629.4,3477.2c-300.3-108.2-333.5-519-55.2-682.4c72.9-44.2,117-46.4,792.8-53l715.5-6.6L5887.8,1538.3C5064,712.3,4682,314.8,4657.7,259.6c-46.4-114.8-42-216.4,17.7-326.8c90.5-170,291.5-240.7,474.8-165.6c55.2,24.3,452.7,406.3,1278.7,1230.1l1196.9,1194.7l6.6-715.5c6.6-675.8,8.8-719.9,53-792.8c53-92.8,163.4-170,267.2-189.9c176.7-33.1,377.6,97.2,426.2,273.8c15.5,66.3,22.1,448.3,17.7,1280.9l-6.6,1185.9l-50.8,81.7c-28.7,44.2-88.3,103.8-132.5,132.5l-81.7,50.8l-1203.6,4.4C5923.1,3508.1,5702.2,3503.7,5629.4,3477.2z"
        />
      </g>
    </svg>
  );
};

export const BarChartIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 20V10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 20V4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 20V14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const BoxIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.6915 2.6302C20.5456 2.138 21.5142 1.87891 22.5 1.87891C23.4859 1.87891 24.4544 2.13802 25.3086 2.63026C25.3099 2.63101 25.3112 2.63176 25.3125 2.63251L38.4375 10.1325C39.2918 10.6257 40.0013 11.3349 40.495 12.1889C40.9886 13.0429 41.249 14.0117 41.25 14.9981V30.002C41.249 30.9884 40.9886 31.9572 40.495 32.8112C40.0013 33.6652 39.2918 34.3744 38.4375 34.8676L38.4303 34.8718L25.3125 42.3676C25.3114 42.3683 25.3103 42.3689 25.3091 42.3695C24.4548 42.862 23.4861 43.1212 22.5 43.1212C21.5139 43.1212 20.5452 42.862 19.691 42.3696C19.6898 42.3689 19.6887 42.3683 19.6875 42.3676L6.56974 34.8718L6.5625 34.8676C5.70824 34.3744 4.99869 33.6652 4.50505 32.8112C4.0114 31.9572 3.75101 30.9884 3.75 30.002V14.9981C3.75101 14.0117 4.0114 13.0429 4.50505 12.1889C4.99869 11.3349 5.70824 10.6257 6.5625 10.1325L6.56973 10.1283L19.6915 2.6302ZM22.5 5.62891C22.1709 5.62891 21.8475 5.71554 21.5625 5.88011L21.5553 5.88428L8.4375 13.3801C8.43651 13.3807 8.43553 13.3812 8.43454 13.3818C8.15111 13.5461 7.91566 13.7819 7.75168 14.0656C7.58727 14.35 7.50048 14.6726 7.5 15.0012V29.9989C7.50048 30.3275 7.58727 30.6501 7.75168 30.9345C7.91566 31.2182 8.15111 31.454 8.43454 31.6183C8.43553 31.6189 8.43651 31.6194 8.4375 31.62L21.5625 39.12C21.8475 39.2846 22.1709 39.3712 22.5 39.3712C22.8291 39.3712 23.1525 39.2846 23.4375 39.12L23.4447 39.1159L36.5625 31.62C36.5635 31.6194 36.5645 31.6189 36.5655 31.6183C36.8489 31.454 37.0843 31.2182 37.2483 30.9345C37.4129 30.6499 37.4997 30.3269 37.5 29.9981V15.002C37.4997 14.6732 37.4129 14.3502 37.2483 14.0656C37.0843 13.7819 36.8489 13.5462 36.5655 13.3818C36.5645 13.3813 36.5635 13.3807 36.5625 13.3801L23.4375 5.88012C23.1525 5.71556 22.8291 5.62891 22.5 5.62891Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.50816 12.1113C5.02667 11.2149 6.17366 10.9086 7.07003 11.4271L22.4999 20.3528L37.9298 11.4271C38.8262 10.9086 39.9732 11.2149 40.4917 12.1113C41.0102 13.0076 40.7039 14.1546 39.8075 14.6731L23.4388 24.1419C22.858 24.4779 22.1419 24.4779 21.5611 24.1419L5.19231 14.6731C4.29595 14.1546 3.98964 13.0076 4.50816 12.1113Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.5 20.625C23.5355 20.625 24.375 21.4645 24.375 22.5V41.4C24.375 42.4355 23.5355 43.275 22.5 43.275C21.4645 43.275 20.625 42.4355 20.625 41.4V22.5C20.625 21.4645 21.4645 20.625 22.5 20.625Z"
        fill={color}
      />
    </svg>
  );
};

export const PaperClipIcon = ({ size = '24', color = 'currentColor' }: IIcons) => {
  return (
    <svg width={size} height={size} viewBox="0 0 35 37" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32.9473 17.4959L18.3965 32.0467C16.6139 33.8293 14.1962 34.8308 11.6752 34.8308C9.15425 34.8308 6.73654 33.8293 4.95395 32.0467C3.17137 30.2642 2.16992 27.8465 2.16992 25.3255C2.16992 22.8045 3.17137 20.3868 4.95395 18.6042L19.5048 4.05341C20.6932 2.86502 22.305 2.19739 23.9856 2.19739C25.6663 2.19739 27.2781 2.86502 28.4665 4.05341C29.6548 5.2418 30.3225 6.8536 30.3225 8.53424C30.3225 10.2149 29.6548 11.8267 28.4665 13.0151L13.8998 27.5659C13.3056 28.1601 12.4997 28.4939 11.6594 28.4939C10.8191 28.4939 10.0132 28.1601 9.41895 27.5659C8.82476 26.9717 8.49094 26.1658 8.49094 25.3255C8.49094 24.4852 8.82476 23.6793 9.41895 23.0851L22.8615 9.65841"
        stroke={color}
        strokeWidth="3.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const GoogleIcon = ({ size = '22' }: IIcons) => {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.9885 9.20341H19.2502V9.16536H11.0002V12.832H16.1807C15.4249 14.9665 13.394 16.4987 11.0002 16.4987C7.96279 16.4987 5.50016 14.0361 5.50016 10.9987C5.50016 7.96132 7.96279 5.4987 11.0002 5.4987C12.4022 5.4987 13.6777 6.02761 14.649 6.89157L17.2417 4.29878C15.6046 2.77299 13.4147 1.83203 11.0002 1.83203C5.93787 1.83203 1.8335 5.93641 1.8335 10.9987C1.8335 16.061 5.93787 20.1654 11.0002 20.1654C16.0625 20.1654 20.1668 16.061 20.1668 10.9987C20.1668 10.3841 20.1036 9.78411 19.9885 9.20341Z"
        fill="#FBC02D"
      />
      <path
        d="M2.89014 6.73207L5.90184 8.94078C6.71676 6.9232 8.69035 5.4987 10.9999 5.4987C12.4019 5.4987 13.6775 6.02761 14.6487 6.89157L17.2415 4.29878C15.6043 2.77299 13.4144 1.83203 10.9999 1.83203C7.47897 1.83203 4.42555 3.81982 2.89014 6.73207Z"
        fill="#E53935"
      />
      <path
        d="M11 20.168C13.3677 20.168 15.5191 19.2618 17.1458 17.7883L14.3087 15.3875C13.3884 16.0847 12.2444 16.5013 11 16.5013C8.61573 16.5013 6.59127 14.981 5.82861 12.8594L2.83936 15.1625C4.35644 18.1311 7.43736 20.168 11 20.168Z"
        fill="#4CAF50"
      />
      <path
        d="M19.9884 9.20601L19.981 9.16797H19.25H11V12.8346H16.1805C15.8175 13.8599 15.158 14.7441 14.3073 15.388C14.3078 15.3876 14.3082 15.3876 14.3087 15.3871L17.1458 17.7878C16.945 17.9703 20.1667 15.5846 20.1667 11.0013C20.1667 10.3867 20.1034 9.78672 19.9884 9.20601Z"
        fill="#1565C0"
      />
    </svg>
  );
};

export const CreditCardIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_4940_20981)">
        <path
          d="M21.5 4H3.5C2.39543 4 1.5 4.89543 1.5 6V18C1.5 19.1046 2.39543 20 3.5 20H21.5C22.6046 20 23.5 19.1046 23.5 18V6C23.5 4.89543 22.6046 4 21.5 4Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M1.5 10H23.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_4940_20981">
          <rect width="24" height="24" fill={color} transform="translate(0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const RequestIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 18V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15H15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const AnnouncementIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M15.54 8.45996C16.4773 9.3976 17.0039 10.6691 17.0039 11.995C17.0039 13.3208 16.4773 14.5923 15.54 15.53"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DocumentIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 13H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 9H9H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ContactIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22 16.9201V19.9201C22.0011 20.1986 21.9441 20.4743 21.8325 20.7294C21.7209 20.9846 21.5573 21.2137 21.3521 21.402C21.1468 21.5902 20.9046 21.7336 20.6407 21.8228C20.3769 21.912 20.0974 21.9452 19.82 21.9201C16.7428 21.5857 13.787 20.5342 11.19 18.8501C8.77382 17.3148 6.72533 15.2663 5.18999 12.8501C3.49997 10.2413 2.44824 7.27109 2.11999 4.1801C2.095 3.90356 2.12787 3.62486 2.21649 3.36172C2.30512 3.09859 2.44756 2.85679 2.63476 2.65172C2.82196 2.44665 3.0498 2.28281 3.30379 2.17062C3.55777 2.05843 3.83233 2.00036 4.10999 2.0001H7.10999C7.5953 1.99532 8.06579 2.16718 8.43376 2.48363C8.80173 2.80008 9.04207 3.23954 9.10999 3.7201C9.23662 4.68016 9.47144 5.62282 9.80999 6.5301C9.94454 6.88802 9.97366 7.27701 9.8939 7.65098C9.81415 8.02494 9.62886 8.36821 9.35999 8.6401L8.08999 9.9101C9.51355 12.4136 11.5864 14.4865 14.09 15.9101L15.36 14.6401C15.6319 14.3712 15.9751 14.1859 16.3491 14.1062C16.7231 14.0264 17.1121 14.0556 17.47 14.1901C18.3773 14.5286 19.3199 14.7635 20.28 14.8901C20.7658 14.9586 21.2094 15.2033 21.5265 15.5776C21.8437 15.9519 22.0122 16.4297 22 16.9201Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const InfoIcon = ({ color = 'currentColor', size = '20' }: IIcons) => {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.5903 8.69044C10.5636 8.5429 10.4826 8.41071 10.3633 8.3199C10.244 8.22909 10.095 8.18624 9.94569 8.19979C9.79637 8.21333 9.65753 8.2823 9.55651 8.3931C9.4555 8.5039 9.39963 8.6485 9.3999 8.79844V14.2008L9.4095 14.3088C9.43622 14.4564 9.5172 14.5886 9.63651 14.6794C9.75581 14.7702 9.90479 14.813 10.0541 14.7995C10.2034 14.7859 10.3423 14.717 10.4433 14.6062C10.5443 14.4954 10.6002 14.3508 10.5999 14.2008V8.79844L10.5903 8.69044ZM10.9587 6.09844C10.9587 5.85974 10.8639 5.63082 10.6951 5.46204C10.5263 5.29326 10.2974 5.19844 10.0587 5.19844C9.82001 5.19844 9.59109 5.29326 9.42231 5.46204C9.25352 5.63082 9.1587 5.85974 9.1587 6.09844C9.1587 6.33713 9.25352 6.56605 9.42231 6.73483C9.59109 6.90362 9.82001 6.99844 10.0587 6.99844C10.2974 6.99844 10.5263 6.90362 10.6951 6.73483C10.8639 6.56605 10.9587 6.33713 10.9587 6.09844ZM19.5999 9.99844C19.5999 7.45236 18.5885 5.01056 16.7881 3.21021C14.9878 1.40986 12.546 0.398438 9.9999 0.398438C7.45382 0.398438 5.01203 1.40986 3.21168 3.21021C1.41133 5.01056 0.399902 7.45236 0.399902 9.99844C0.399902 12.5445 1.41133 14.9863 3.21168 16.7867C5.01203 18.587 7.45382 19.5984 9.9999 19.5984C12.546 19.5984 14.9878 18.587 16.7881 16.7867C18.5885 14.9863 19.5999 12.5445 19.5999 9.99844ZM1.5999 9.99844C1.5999 8.89533 1.81717 7.80303 2.23931 6.7839C2.66145 5.76476 3.28019 4.83875 4.06021 4.05874C4.84022 3.27873 5.76623 2.65999 6.78536 2.23785C7.8045 1.81571 8.8968 1.59844 9.9999 1.59844C11.103 1.59844 12.1953 1.81571 13.2144 2.23785C14.2336 2.65999 15.1596 3.27873 15.9396 4.05874C16.7196 4.83875 17.3384 5.76476 17.7605 6.7839C18.1826 7.80303 18.3999 8.89533 18.3999 9.99844C18.3999 12.2263 17.5149 14.3628 15.9396 15.9381C14.3643 17.5134 12.2277 18.3984 9.9999 18.3984C7.77208 18.3984 5.63551 17.5134 4.06021 15.9381C2.4849 14.3628 1.5999 12.2263 1.5999 9.99844Z"
        fill={color}
      />
    </svg>
  );
};

export const ImportIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 1V5C13 5.26522 13.1054 5.51957 13.2929 5.70711C13.4804 5.89464 13.7348 6 14 6H18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 11V3C4 2.46957 4.21071 1.96086 4.58579 1.58579C4.96086 1.21071 5.46957 1 6 1H13L18 6V17C18 17.5304 17.7893 18.0391 17.4142 18.4142C17.0391 18.7893 16.5304 19 16 19H10.5M1 17H8M8 17L5 14M8 17L5 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CheckMarkIcon = ({ color = '#189915', size = '24' }: IIcons) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M22 11.0801V12.0001C21.9988 14.1565 21.3005 16.2548 20.0093 17.9819C18.7182 19.7091 16.9033 20.9726 14.8354 21.584C12.7674 22.1954 10.5573 22.122 8.53447 21.3747C6.51168 20.6274 4.78465 19.2462 3.61096 17.4372C2.43727 15.6281 1.87979 13.4882 2.02168 11.3364C2.16356 9.18467 2.99721 7.13643 4.39828 5.49718C5.79935 3.85793 7.69279 2.71549 9.79619 2.24025C11.8996 1.76502 14.1003 1.98245 16.07 2.86011"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M22 4L12 14.01L9 11.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const NextIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 5L19 12L12 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PrevIcon = ({ color = 'currentColor' }: IIcons) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 5L5 12L12 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
