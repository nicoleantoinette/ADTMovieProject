import React from "react";
const InputBox = ({
  icon = null,
  type = "text",
  placeholder = "",
  value = "",
  onChange,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        margin: "0px 0px 15px 0px",
      }}
    >
      {/* Input field */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          paddingRight: "40px", // Adds padding to the right for the icon
          paddingLeft: icon ? "40px" : "20px", // Space for left-side icons
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          fontSize: "16px",
        }}
      />
      {/* Render the icon inside the input */}
      {icon && (
        <div
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "18px",
            color: "#00796b",
          }}
        >
          {icon}
        </div>
      )}
    </div>
  );
};

export default InputBox;
