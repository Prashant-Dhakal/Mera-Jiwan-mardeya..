import React from "react";
import Avatar from "@mui/material/Avatar";

const SmallProfile = () => {
  return (
    <div className="bg-[#008080] flex items-center p-4 sm:p-6 rounded-lg shadow-md max-w-xs sm:max-w-sm lg:max-w-md mx-auto">
      {/* Avatar */}
      <Avatar
        alt="Prashant Dhakal"
        src="https://scontent.fbir4-1.fna.fbcdn.net/v/t39.30808-6/458099328_544336611497492_6535813158881838660_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=i170lheAoh0Q7kNvgGmYL0e&_nc_ht=scontent.fbir4-1.fna&_nc_gid=AfywJoGv58Xxgd5g_36KbxN&oh=00_AYABK83UaS9oRabM_d91AWTDq8x5LcV5x7NluV6YaGe13g&oe=66F2FAB6"
        sx={{ width: 56, height: 56 }}
      />
      {/* Profile Information */}
      <section className="flex justify-center flex-col px-4 sm:px-6">
        <h2
          className="text-[#343A40] font-bold text-base sm:text-lg lg:text-xl"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          Prashant Dhakal
        </h2>
        <h4
          className="text-white text-xs sm:text-sm lg:text-base"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          Oi khata
        </h4>
      </section>
    </div>
  );
};

export default SmallProfile;
