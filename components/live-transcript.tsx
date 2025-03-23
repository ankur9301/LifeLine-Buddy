"use client";

import { cn } from "@/lib/utils";
import type { Emergency } from "@/types/emergency";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Clock, Phone, PlayCircle, PauseCircle } from "lucide-react";

interface LiveTranscriptProps {
  emergency: Emergency;
  onCloseCase: (id: string) => void;
  onTransfer: (id: string) => void;  // Add this
}


export function LiveTranscript({
  emergency,
  onCloseCase,
  onTransfer,
}: LiveTranscriptProps) {
  const [transcript, setTranscript] = useState<typeof emergency.transcript>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isTransferred, setIsTransferred] = useState(false);
  const [transferStatus, setTransferStatus] = useState<Record<string, "idle" | "transferring" | "transferred">>({});

  const handleTransfer = (id: string) => {
    setTransferStatus((prev) => ({ ...prev, [id]: "transferring" }));
  
    setTimeout(() => {
      setTransferStatus((prev) => ({ ...prev, [id]: "transferred" }));
      onTransfer(id); 
    }, 1500);
  };
  



  const handleToggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    setTranscript(emergency.transcript || []);
  }, [emergency]);

  const handleCloseCase = async () => {
    setIsClosing(true);
    try {
      onCloseCase(emergency.id);
      setDialogOpen(false);
    } catch (error) {
      console.error("Error closing case:", error);
    } finally {
      setIsClosing(false);
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return timeString;
    }
  };

  return (
    console.log("Emergency Time:", emergency.time),
    (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-medium">Live Transcript</h2>

            {/* Play/Pause Button */}
            <button onClick={handleToggleAudio}>
              {isPlaying ? (
                <PauseCircle className="h-5 w-5 text-muted-foreground hover:text-primary transition" />
              ) : (
                <PlayCircle className="h-5 w-5 text-muted-foreground hover:text-primary transition" />
              )}
            </button>

            {/* Audio Element */}
            <audio
              ref={audioRef}
              src={`data:audio/wav;base64,${emergency.encoded_audio}`}
              onEnded={handleAudioEnded}
            />
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground whitespace-nowrap">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{emergency.time}</span>
            </div>
            {emergency.phone_number && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>{emergency.phone_number}</span>
              </div>
            )}
          </div>
        </div>

        {/* Transcript Section */}
        <div className="flex-1 overflow-auto p-2 sm:p-4">
          <AnimatePresence>
            <div className="space-y-3">
              {transcript.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex max-w-[85%] sm:max-w-[80%] flex-col rounded-lg p-2 sm:p-3",
                    message.role === "agent"
                      ? "ml-auto bg-primary/90 text-primary-foreground"
                      : "mr-auto bg-muted/70"
                  )}
                >
                  <div className="mb-1 text-xs font-medium">
                    {message.role === "agent" ? "Operator" : "Caller"}
                  </div>
                  <div className="text-xs sm:text-sm">{message.message}</div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start text-xs sm:text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-2 ml-1 mt-1">
                    <div className="flex space-x-1">
                      <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-bounce rounded-full bg-muted-foreground" />
                      <div
                        className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                    <span>Typing...</span>
                  </div>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </div>

        {/* Bottom Buttons */}
        <div className="border-t p-2 sm:p-4">
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 text-xs sm:text-sm"
              onClick={() => onCloseCase(emergency.id)}
            >
              Close Case
            </Button>
            <Button
              size="sm"
              className="flex-1 text-xs sm:text-sm transition-all"
              variant={transferStatus[emergency.id] === "transferred" ? "success" : "default"}
              disabled={transferStatus[emergency.id] === "transferring" || transferStatus[emergency.id] === "transferred"}
              onClick={() => handleTransfer(emergency.id)}
            >
              {transferStatus[emergency.id] === "transferring"
                ? "Transferring to Operator..."
                : transferStatus[emergency.id] === "transferred"
                ? "Transferred to Operator"
                : "Transfer"}
            </Button>

          </div>
        </div>
      </div>
    )
  );
}
