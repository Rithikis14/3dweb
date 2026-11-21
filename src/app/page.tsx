import CanvasContainer from "@/components/CanvasContainer";
import OverlayHUD from "@/components/OverlayHUD";

export default function Home() {
  return (
    <main className="relative w-full">
      {/* 
        This empty div creates the scrollable area. 
        Adjusting the height changes how long it takes to scroll through the frames. 
        Since we have ~470 frames, 800vh gives a nice, smooth scrubbing pace.
      */}
      <div className="h-[800vh] w-full" />
      
      {/* 
        The Canvas Container renders the fixed 60fps frame sequence 
        and is placed in the background.
      */}
      <CanvasContainer />
      
      {/* 
        The Overlay HUD renders the fixed typography and UI elements 
        that fade in/out based on the scroll progress.
      */}
      <OverlayHUD />
    </main>
  );
}
