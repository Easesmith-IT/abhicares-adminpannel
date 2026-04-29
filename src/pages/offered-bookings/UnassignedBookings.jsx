import React from "react";
import Wrapper from "../../components/wrappers/Wrapper";
import { BackLink } from "../../components/shared/back-link";
import { H2 } from "../../components/shared/typography";

const UnassignedBookings = () => {
  return (
    <Wrapper>
      <div>
        <BackLink>
          <H2>Unassigned Bookings</H2>
        </BackLink>
      </div>
    </Wrapper>
  );
};

export default UnassignedBookings;
