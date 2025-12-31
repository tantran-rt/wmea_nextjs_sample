import React from "react";
import "./IDCard.css"; // Import the CSS file for styling
import { setIdDetails } from "@/redux/slices/drugTest";
import { useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";

const IDCard = ({ idDetails }: { idDetails: any }) => {
  const dispatch = useDispatch();

  if (!idDetails) {
    return <p>No ID details available.</p>;
  } else {
    dispatch(setIdDetails(idDetails));
  }

  return (
    <div className="id-card">
      <div className="id-card-heder">
        <Image src={"/icons/licence-id.svg"} alt={""} width={48} height={48} />
        <h2 className="id-card-title">Driver`s License Information</h2>
      </div>
      <div className="id-card-details">
        <div className="wrap-id-items">
          <Image src={"/icons/person-id.svg"} alt={""} width={24} height={24} />
          <p>
            <strong>Last Name:</strong> {idDetails?.last_name || "N/A"}
          </p>
        </div>
        <div className="wrap-id-items">
          <Image src={"/icons/person-id.svg"} alt={""} width={24} height={24} />
          <p>
            <strong>First Name:</strong> {idDetails?.first_name || "N/A"}
          </p>
        </div>
        <div className="wrap-id-items">
          <Image src={"/icons/date-id.svg"} alt={""} width={24} height={24} />
          <p>
            <strong>Date of Birth:</strong> {idDetails?.date_of_birth || "N/A"}
          </p>
        </div>
        <div className="wrap-id-items">
          <Image src={"/icons/gender-id.svg"} alt={""} width={24} height={24} />
          <p>
            <strong>Gender:</strong> {idDetails?.gender}
          </p>
        </div>
        <div className="wrap-id-items">
          <Image
            src={"/icons/eye-color-id.svg"}
            alt={""}
            width={24}
            height={24}
          />
          <p>
            <strong>Eye Color:</strong> {idDetails?.eye_color || "N/A"}
          </p>
        </div>
        <div className="wrap-id-items">
          <Image src={"/icons/height-id.svg"} alt={""} width={24} height={24} />
          <p>
            <strong>Height:</strong> {idDetails?.height || "N/A"}
          </p>
        </div>
        <div className="wrap-id-items">
          <Image
            src={"/icons/address-id.svg"}
            alt={""}
            width={24}
            height={24}
          />
          <p>
            <strong>Address:</strong> {idDetails?.address || "N/A"}
          </p>
        </div>
        <div className="wrap-id-items">
          <Image src={"/icons/city-id.svg"} alt={""} width={24} height={24} />
          <p>
            <strong>City:</strong> {idDetails?.city || "N/A"}
          </p>
        </div>
        <div className="wrap-id-items">
          <Image src={"/icons/state-id.svg"} alt={""} width={24} height={24} />
          <p>
            <strong>State:</strong> {idDetails?.state || "N/A"}
          </p>
        </div>
        <div className="wrap-id-items">
          <Image src={"/icons/zip-id.svg"} alt={""} width={24} height={24} />
          <p>
            <strong>Zip Code:</strong> {idDetails?.zipcode || "N/A"}
          </p>
        </div>
      </div>
      <Link
        className="link-con"
        href={"/identity-profile/sample-facial-capture"}
      >
        Continue
      </Link>
    </div>
  );
};

export default IDCard;
