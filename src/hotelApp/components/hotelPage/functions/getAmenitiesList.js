/*returns object containing name, group and svg from amenity name argument  */
const getAmenity = (amenityName) => {
  let newAmenity = false;

  switch (amenityName) {
    case "courtyard":
      newAmenity = {
        name: "Courtyard view",
        group: "Outdoor",
        svg: [
          <path d="M16 1a5 5 0 0 1 5 5 5 5 0 0 1 0 10 5.002 5.002 0 0 1-4 4.9v4.287C18.652 23.224 21.153 22 23.95 22a8.94 8.94 0 0 1 3.737.814l.313.15.002 2.328A6.963 6.963 0 0 0 23.95 24c-3.542 0-6.453 2.489-6.93 5.869l-.02.15-.006.098a1 1 0 0 1-.876.876L16 31a1 1 0 0 1-.974-.77l-.02-.124C14.635 26.623 11.615 24 7.972 24a6.963 6.963 0 0 0-3.97 1.234l.002-2.314c1.218-.6 2.57-.92 3.968-.92 2.818 0 5.358 1.24 7.028 3.224V20.9a5.002 5.002 0 0 1-3.995-4.683L11 16l-.217-.005a5 5 0 0 1 0-9.99L11 6l.005-.217A5 5 0 0 1 16 1zm2.864 14.1c-.811.567-1.799.9-2.864.9s-2.053-.333-2.864-.9l-.062.232a3 3 0 1 0 5.851.001zM11 8a3 3 0 1 0 .667 5.926l.234-.062A4.977 4.977 0 0 1 11 11c0-1.065.333-2.053.9-2.864l-.232-.062A3.013 3.013 0 0 0 11 8zm10 0c-.228 0-.45.025-.667.074l-.234.062C20.667 8.947 21 9.935 21 11a4.977 4.977 0 0 1-.9 2.864l.232.062A3 3 0 1 0 21 8zm-5 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0-5a3 3 0 0 0-2.926 3.667l.062.234C13.947 6.333 14.935 6 16 6s2.053.333 2.864.9l.062-.232A3 3 0 0 0 16 3z"></path>,
        ],
      };
      break;
    case "kitchen":
      newAmenity = {
        name: "Kitchen",
        group: "Kitchen and dining",
        svg: [
          <path d="M26 1a5 5 0 0 1 5 5c0 6.389-1.592 13.187-4 14.693V31h-2V20.694c-2.364-1.478-3.942-8.062-3.998-14.349L21 6l.005-.217A5 5 0 0 1 26 1zm-9 0v18.118c2.317.557 4 3.01 4 5.882 0 3.27-2.183 6-5 6s-5-2.73-5-6c0-2.872 1.683-5.326 4-5.882V1zM2 1h1c4.47 0 6.934 6.365 6.999 18.505L10 21H3.999L4 31H2zm14 20c-1.602 0-3 1.748-3 4s1.398 4 3 4 3-1.748 3-4-1.398-4-3-4zM4 3.239V19h3.995l-.017-.964-.027-.949C7.673 9.157 6.235 4.623 4.224 3.364l-.12-.07zm19.005 2.585L23 6l.002.31c.045 4.321 1.031 9.133 1.999 11.39V3.17a3.002 3.002 0 0 0-1.996 2.654zm3.996-2.653v14.526C27.99 15.387 29 10.4 29 6a3.001 3.001 0 0 0-2-2.829z"></path>,
        ],
      };
      break;
    case "wifi":
      newAmenity = {
        name: "Wifi",
        group: "Internet and office",
        svg: [
          <path d="m15.9999 20.33323c2.0250459 0 3.66667 1.6416241 3.66667 3.66667s-1.6416241 3.66667-3.66667 3.66667-3.66667-1.6416241-3.66667-3.66667 1.6416241-3.66667 3.66667-3.66667zm0 2c-.9204764 0-1.66667.7461936-1.66667 1.66667s.7461936 1.66667 1.66667 1.66667 1.66667-.7461936 1.66667-1.66667-.7461936-1.66667-1.66667-1.66667zm.0001-7.33323c3.5168171 0 6.5625093 2.0171251 8.0432368 4.9575354l-1.5143264 1.5127043c-1.0142061-2.615688-3.5549814-4.4702397-6.5289104-4.4702397s-5.5147043 1.8545517-6.52891042 4.4702397l-1.51382132-1.5137072c1.48091492-2.939866 4.52631444-4.9565325 8.04273174-4.9565325zm.0001-5.3332c4.9804693 0 9.3676401 2.540213 11.9365919 6.3957185l-1.4470949 1.4473863c-2.1746764-3.5072732-6.0593053-5.8431048-10.489497-5.8431048s-8.31482064 2.3358316-10.48949703 5.8431048l-1.44709488-1.4473863c2.56895177-3.8555055 6.95612261-6.3957185 11.93659191-6.3957185zm-.0002-5.3336c6.4510616 0 12.1766693 3.10603731 15.7629187 7.9042075l-1.4304978 1.4309874c-3.2086497-4.44342277-8.4328305-7.3351949-14.3324209-7.3351949-5.8991465 0-11.12298511 2.89133703-14.33169668 7.334192l-1.43047422-1.4309849c3.58629751-4.79760153 9.31155768-7.9032071 15.7621709-7.9032071z"></path>,
        ],
      };
      break;
    case "workspace":
      newAmenity = {
        name: "Dedicated workspace",
        group: "Internet and office",
        svg: [
          <path d="M26 2a1 1 0 0 1 .922.612l.04.113 2 7a1 1 0 0 1-.847 1.269L28 11h-3v5h6v2h-2v13h-2l.001-2.536a3.976 3.976 0 0 1-1.73.527L25 29H7a3.982 3.982 0 0 1-2-.535V31H3V18H1v-2h5v-4a1 1 0 0 1 .883-.993L7 11h.238L6.086 8.406l1.828-.812L9.427 11H12a1 1 0 0 1 .993.883L13 12v4h10v-5h-3a1 1 0 0 1-.987-1.162l.025-.113 2-7a1 1 0 0 1 .842-.718L22 2h4zm1 16H5v7a2 2 0 0 0 1.697 1.977l.154.018L7 27h18a2 2 0 0 0 1.995-1.85L27 25v-7zm-16-5H8v3h3v-3zm14.245-9h-2.491l-1.429 5h5.349l-1.429-5z"></path>,
        ],
      };
      break;
    case "tv":
      newAmenity = {
        name: "TV",
        group: "Entertainment",
        svg: [
          <path d="M9 29v-2h2v-2H6a5 5 0 0 1-4.995-4.783L1 20V8a5 5 0 0 1 4.783-4.995L6 3h20a5 5 0 0 1 4.995 4.783L31 8v12a5 5 0 0 1-4.783 4.995L26 25h-5v2h2v2zm10-4h-6v2h6zm7-20H6a3 3 0 0 0-2.995 2.824L3 8v12a3 3 0 0 0 2.824 2.995L6 23h20a3 3 0 0 0 2.995-2.824L29 20V8a3 3 0 0 0-2.824-2.995z"></path>,
        ],
      };
      break;
    case "carbonAlarm":
      newAmenity = {
        name: "Carbon monoxide alarm",
        group: "Home safety",
        unavailable: true,
        svg: [
          <path d="M2.05 6.292L4 8.242V25a3 3 0 0 0 2.824 2.995L7 28h16.757l1.95 1.95c-.161.023-.325.038-.49.045L25 30H7a5 5 0 0 1-4.995-4.783L2 25V7c0-.24.017-.477.05-.708zm1.657-4l26 26-1.414 1.415-26-26 1.414-1.414zM25 2a5 5 0 0 1 4.995 4.783L30 7v18c0 .24-.017.476-.05.707L28 23.757V7a3 3 0 0 0-2.824-2.995L25 4H8.242l-1.95-1.95c.162-.023.325-.038.491-.045L7 2h18zM11.1 17a5.006 5.006 0 0 0 3.9 3.9v2.03A7.005 7.005 0 0 1 9.071 17h2.03zm5.9 4.243l1.352 1.352a6.954 6.954 0 0 1-1.351.334L17 21.243zM21.243 17l1.686.001c-.067.467-.18.919-.334 1.351L21.243 17zm-4.242-7.929A7.005 7.005 0 0 1 22.929 15H20.9A5.006 5.006 0 0 0 17 11.1l.001-2.029zm-7.596 4.577L10.757 15 9.071 15c.067-.467.18-.92.334-1.352zM15 9.071l-.001 1.686-1.35-1.352A6.954 6.954 0 0 1 15 9.07zM23 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>,
        ],
      };
      break;
    case "smokeAlarm":
      newAmenity = {
        name: "Smoke alarm",
        group: "Home safety",
        unavailable: true,
        svg: [
          <path d="M3.486 7.727l1.447 1.448A12.94 12.94 0 0 0 3 16c0 7.18 5.82 13 13 13 2.503 0 4.84-.707 6.824-1.933l1.448 1.448A14.93 14.93 0 0 1 16 31C7.716 31 1 24.284 1 16c0-3.057.915-5.901 2.486-8.273zm.221-5.434l26 26-1.414 1.414-26-26 1.414-1.414zM16 1c8.284 0 15 6.716 15 15 0 3.057-.914 5.9-2.485 8.272l-1.448-1.448A12.94 12.94 0 0 0 29 16c0-7.18-5.82-13-13-13a12.94 12.94 0 0 0-6.825 1.933L7.727 3.486A14.93 14.93 0 0 1 16 1zm-4.9 16a5.006 5.006 0 0 0 3.9 3.9v2.03A7.005 7.005 0 0 1 9.071 17h2.03zm5.9 4.243l1.352 1.352a6.954 6.954 0 0 1-1.351.334L17 21.243zM21.243 17l1.686.001c-.067.467-.18.919-.334 1.351L21.243 17zm-4.242-7.929A7.005 7.005 0 0 1 22.929 15H20.9A5.006 5.006 0 0 0 17 11.1l.001-2.029zm-7.596 4.577L10.757 15 9.071 15c.067-.467.18-.92.334-1.352zM15 9.071l-.001 1.686-1.35-1.352A6.954 6.954 0 0 1 15 9.07zM23 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>,
        ],
      };
      break;
    case "hairDryer":
      newAmenity = {
        name: "Hair dryer",
        group: "Bathroom",
        svg: [
          <path d="M14 27l-.005.2a4 4 0 0 1-3.789 3.795L10 31H4v-2h6l.15-.005a2 2 0 0 0 1.844-1.838L12 27zM10 1c.536 0 1.067.047 1.58.138l.38.077 17.448 3.64a2 2 0 0 1 1.585 1.792l.007.166v6.374a2 2 0 0 1-1.431 1.917l-.16.04-13.554 2.826 1.767 6.506a2 2 0 0 1-1.753 2.516l-.177.008H11.76a2 2 0 0 1-1.879-1.315l-.048-.15-1.88-6.769A9 9 0 0 1 10 1zm5.692 24l-1.799-6.621-1.806.378a8.998 8.998 0 0 1-1.663.233l-.331.008L11.76 25zM10 3a7 7 0 1 0 1.32 13.875l.331-.07L29 13.187V6.813L11.538 3.169A7.027 7.027 0 0 0 10 3zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"></path>,
        ],
      };
      break;
    case "shampoo":
      newAmenity = {
        name: "Shampoo",
        group: "Bathroom",
        svg: [
          <path d="M20 1v2h-3v2h1a2 2 0 0 1 1.995 1.85L20 7v2a4 4 0 0 1 3.995 3.8L24 13v14a4 4 0 0 1-3.8 3.995L20 31h-8a4 4 0 0 1-3.995-3.8L8 27V13a4 4 0 0 1 3.8-3.995L12 9V7a2 2 0 0 1 1.85-1.995L14 5h1V3H8V1zm2 21H10v5a2 2 0 0 0 1.85 1.995L12 29h8a2 2 0 0 0 1.995-1.85L22 27zm0-6H10v4h12zm-2-5h-8a2 2 0 0 0-1.995 1.85L10 13v1h12v-1a2 2 0 0 0-2-2zm-2-4h-4v2h4z"></path>,
        ],
      };
      break;
    case "essentials":
      newAmenity = {
        name: "Essentials",
        group: "Bedroom and laundry",
        sub: "Towels, bed sheets, soap and toilet paper",
        svg: [
          <path d="M11 1v7l1.898 20.819.007.174c-.025 1.069-.804 1.907-1.818 1.999a2 2 0 0 1-.181.008h-7.81l-.174-.008C1.86 30.87 1.096 30.018 1.096 29l.002-.09 1.907-21L3.001 1zm6 0l.15.005a2 2 0 0 1 1.844 1.838L19 3v7.123l-2 8V31h-2V18.123l.007-.163.02-.162.033-.16L16.719 11H13V1zm11 0a2 2 0 0 1 1.995 1.85L30 3v26a2 2 0 0 1-1.85 1.995L28 31h-7v-2h7v-2h-7v-2h7v-2h-7v-2h7v-2h-7v-2h7v-2h-7v-2h7v-2h-7V9h7V7h-7V5h7V3h-7V1zM9.088 9h-4.18L3.096 29l.058.002L10.906 29l-.004-.058zM17 3h-2v6h2zM9.002 3H5L5 7h4.004z"></path>,
        ],
      };
      break;
    case "ac":
      newAmenity = {
        name: "Air conditioning",
        group: "Heating and cooling",
        svg: [
          <path d="M14 27l-.005.2a4 4 0 0 1-3.789 3.795L10 31H4v-2h6l.15-.005a2 2 0 0 0 1.844-1.838L12 27zM10 1c.536 0 1.067.047 1.58.138l.38.077 17.448 3.64a2 2 0 0 1 1.585 1.792l.007.166v6.374a2 2 0 0 1-1.431 1.917l-.16.04-13.554 2.826 1.767 6.506a2 2 0 0 1-1.753 2.516l-.177.008H11.76a2 2 0 0 1-1.879-1.315l-.048-.15-1.88-6.769A9 9 0 0 1 10 1zm5.692 24l-1.799-6.621-1.806.378a8.998 8.998 0 0 1-1.663.233l-.331.008L11.76 25zM10 3a7 7 0 1 0 1.32 13.875l.331-.07L29 13.187V6.813L11.538 3.169A7.027 7.027 0 0 0 10 3zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"></path>,
        ],
      };
      break;
    case "heating":
      newAmenity = {
        name: "Heating",
        group: "Heating and cooling",
        svg: [
          <path d="M16 0a5 5 0 0 1 4.995 4.783L21 5l.001 12.756.26.217a7.984 7.984 0 0 1 2.717 5.43l.017.304L24 24a8 8 0 1 1-13.251-6.036l.25-.209L11 5A5 5 0 0 1 15.563.019l.22-.014zm0 2a3 3 0 0 0-2.995 2.824L13 5v13.777l-.428.298a6 6 0 1 0 7.062.15l-.205-.15-.428-.298L19 11h-4V9h4V7h-4V5h4a3 3 0 0 0-3-3zm1 11v7.126A4.002 4.002 0 0 1 16 28a4 4 0 0 1-1-7.874V13zm-1 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path>,
        ],
      };
      break;
    case "fireExtinguisher":
      newAmenity = {
        name: "Fire extinguisher",
        group: "Home safety",
        svg: [
          <path d="M7 28H5V15c0-4.997 3.356-9.304 8.061-10.603A3 3 0 0 1 17.69 2.52l2.66-2.28 1.302 1.52L19.036 4H23v2h-4.17A3.008 3.008 0 0 1 17 7.83l.001.242a7.007 7.007 0 0 1 5.982 6.446l.013.24L23 15v15a2 2 0 0 1-1.85 1.995L21 32H11a2 2 0 0 1-1.995-1.85L9 30v-6H7zm9-18c-2.617 0-4.775 2.014-4.983 4.573l-.013.22L11 15v15h10V15.018l-.003-.206A5 5 0 0 0 16 10zm-2.654-3.6a9.002 9.002 0 0 0-6.342 8.327L7 15v7h2v-7.018l.005-.244A7.001 7.001 0 0 1 15 8.071v-.242a3.01 3.01 0 0 1-1.654-1.43zM16 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>,
        ],
      };
      break;
    case "firstAid":
      newAmenity = {
        name: "First aid kit",
        group: "Home safety",
        svg: [
          <path d="M26 3a5 5 0 0 1 4.995 4.783L31 8v16a5 5 0 0 1-4.783 4.995L26 29H6a5 5 0 0 1-4.995-4.783L1 24V8a5 5 0 0 1 4.783-4.995L6 3zm0 2H6a3 3 0 0 0-2.995 2.824L3 8v16a3 3 0 0 0 2.824 2.995L6 27h20a3 3 0 0 0 2.995-2.824L29 24V8a3 3 0 0 0-2.824-2.995zm-7 4v4h4v6h-4v4h-6v-4.001L9 19v-6l4-.001V9zm-2.001 2h-2L15 14.999h-4.001V17L15 16.998 14.999 21h2L17 17h3.999v-2H17z"></path>,
        ],
      };
      break;
    case "fridge":
      newAmenity = {
        name: "Refrigerator",
        group: "Kitchen and dining",
        svg: [
          <path d="M25 1a2 2 0 0 1 1.995 1.85L27 3v26a2 2 0 0 1-1.85 1.995L25 31H7a2 2 0 0 1-1.995-1.85L5 29V3a2 2 0 0 1 1.85-1.995L7 1zm0 10H7v18h18zm-15 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM25 3H7v6h18zM10 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>,
        ],
      };
      break;
    case "coffeeMaker":
      newAmenity = {
        name: "Coffee maker",
        group: "Kitchen and dining",
        svg: [
          <path d="M25 2a1 1 0 0 1 .936.649l.034.108 1 4a1 1 0 0 1-.857 1.237L26 8h-9v2h-2V7.999H4.999v20l3 .001a5 5 0 0 1-.716-4.66l.102-.263 2.515-6.04-1.794-3.59a1 1 0 0 1 .779-1.44L9 12h14a1 1 0 0 1 .94 1.341l-.046.106L22.618 16H24a5 5 0 0 1 4.995 4.783L29 21v4h-2v-4a3 3 0 0 0-2.824-2.995L24 18h-1.5l2.115 5.077A4.998 4.998 0 0 1 24 28L27 28v2H4a1 1 0 0 1-.993-.883L3 29V3a1 1 0 0 1 .883-.993L4 2zM12.647 22a6.638 6.638 0 0 0-2.91.628l-.506 1.218a3 3 0 0 0-.194.682l-.028.235L9 25a3 3 0 0 0 2.824 2.995l.156.004 8.027.001.23-.01a3 3 0 0 0 2.603-2.023c-1.692-.121-2.93-.67-4.836-1.889l-.375-.243C15.493 22.44 14.452 22 12.647 22zm7.686-4h-8.667l-.913 2.188A9.062 9.062 0 0 1 12.647 20c2.188 0 3.515.52 5.75 1.95l.38.246c1.74 1.136 2.741 1.627 4.034 1.76l-.042-.11zm1.048-4H10.618l1 2h8.763zm2.837-10.001H4.999v2h19.719z"></path>,
        ],
      };
      break;
    case "washingMachine":
      newAmenity = {
        name: "Washing Machine",
        group: "Kitchen and dining",
        absent: true,
        svg: [
          <path d="M2 6.242l2 2V28h19.757l2 2H4a2 2 0 0 1-1.995-1.85L2 28V6.242zm1.707-3.95l26 26-1.414 1.415-26-26 1.414-1.414zM28 2a2 2 0 0 1 1.994 1.85L30 4v21.757l-2-2V4H8.242L6.236 2.005 28 2zM7.877 12.12l2.383 2.38h-.101c-.342 0-.68.024-1.014.073a7 7 0 0 0 9.207 8.022l1.527 1.528A9 9 0 0 1 7.877 12.12zM16 7a9 9 0 0 1 8.123 12.88l-2.695-2.694h.04c.493 0 .98-.05 1.456-.151a7 7 0 0 0-9.277-7.63L12.12 7.877A8.965 8.965 0 0 1 16 7z"></path>,
        ],
      };
      break;
  }
  return newAmenity;
};

/* compiles list of amenity objects. Gives outputs in both satrndard and modal format */
const getAmenitiesList = (amenitiesArray, listLength) => {
  let newAmenitiesArray = [...amenitiesArray];
  let newAmenityList = [];
  let groupList = [
    "Bathroom",
    "Bedroom and laundry",
    "Entertainment",
    "Heating and cooling",
    "Internet and office",
    "Outdoor",
    "Kitchen and dining",
    "Home safety",
  ];
  let newGroupObject = {};

  /* populates groupObject with keys and sets value type as array */
  for (let i = 0; i < groupList.length; i++) {
    newGroupObject[groupList[i]] = [];
  }

  if (amenitiesArray === "random") {
    amenitiesArray = [
      "washingMachine",
      "coffeeMaker",
      "fridge",
      "firstAid",
      "fireExtinguisher",
      "heating",
      "ac",
      "essentials",
      "shampoo",
      "hairDryer",
      "carbonAlarm",
      "tv",
      "workspace",
      "wifi",
      "kitchen",
      "courtyard",
    ];

    /* randomly deletes a specified number of elements from the main amenities array */
    let i = amenitiesArray.length;
    while (i > listLength) {
      const random = Math.floor(Math.random() * newAmenitiesArray.length);
      amenitiesArray.splice(random, 1);
      i--;
    }
  }

  /* populates data for each of the amenities in amenities array */
  for (let i = 0; i < amenitiesArray.length; i++) {
    const amenityObject = getAmenity(amenitiesArray[i]);
    newAmenityList.push(amenityObject);
    newGroupObject[amenityObject.group].push(amenityObject);
  }

  let newModalList = [];

  /* sorts amenities into the relevant groups (for the headed list in the modal) */
  for (let i = 0; i < groupList.length; i++) {
    if (newGroupObject[groupList[i]].length > 0) {
      newModalList.push({
        name: groupList[i],
        items: newGroupObject[groupList[i]],
      });
    }
  }

  console.log("newAmenityList: " + newAmenityList);
  console.log("newGroupObject: " + newGroupObject);
  console.log("newAmenityList.length: " + newAmenityList.length);

  return { list: newAmenityList, modalList: newModalList };
};

export default getAmenitiesList