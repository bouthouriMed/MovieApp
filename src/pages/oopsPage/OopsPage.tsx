import React from "react";
import { Link } from "react-router-dom";
import "./OopsPage.scss";
import { ROUTES_URLS } from "@/routes";

const OopsPage: React.FC = () => {
  return (
    <div className="oops-page">
      <div className="oops-card">
        <h1 className="oops-title">😬 Oops!</h1>
        <p className="oops-message">
          Something went wrong. Don’t worry, we’ve got you covered.
        </p>
        <Link to={ROUTES_URLS.Home} className="oops-button">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OopsPage;
