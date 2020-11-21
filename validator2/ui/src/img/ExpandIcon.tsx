import React from "react";
import { SvgIcon } from "@material-ui/core";

/**
 * Grommet icon: Expand
 * https://github.com/grommet/grommet-icons/blob/master/src/js/icons/Expand.js
 */
export const ExpandIcon: React.FC = () => (
  <SvgIcon>
    <path
      fill="none"
      stroke="#fff"
      strokeWidth="3"
      d="M10,14 L2,22 M1,15 L1,23 L9,23 M22,2 L14,10 M15,1 L23,1 L23,9"
    />
  </SvgIcon>
);
