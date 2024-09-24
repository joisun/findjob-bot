import { SVGProps } from "react";

  
export function DragSvgIcon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 6h.006M6 12h.006M6 18h.006m5.99-12h.007m-.006 6h.006m-.006 6h.006m5.99-12H18m-.006 6H18m-.006 6H18" color="currentColor"></path></svg>
    )
  }