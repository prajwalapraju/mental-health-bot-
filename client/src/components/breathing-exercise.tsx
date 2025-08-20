import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timer, setTimer] = useState(4);
  const [sessionTime, setSessionTime] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(3); // in minutes
  const intervalRef = useRef<NodeJS.Timeout>();
  const phaseIntervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const phaseDurations = {
    inhale: 4,
    hold: 4,
    exhale: 6,
  };

  const breathingMutation = useMutation({
    mutationFn: async (data: { duration: number; completed: boolean }) => {
      const response = await apiRequest("POST", "/api/breathing", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/breathing"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);

      startBreathingCycle();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    // Check if session is complete
    if (sessionTime >= selectedDuration * 60 && isActive) {
      handleComplete();
    }
  }, [sessionTime, selectedDuration, isActive]);

  const startBreathingCycle = () => {
    const cycleDuration = phaseDurations.inhale + phaseDurations.hold + phaseDurations.exhale;
    let currentTime = 0;
    
    const updatePhase = () => {
      const cycleProgress = currentTime % cycleDuration;
      
      if (cycleProgress < phaseDurations.inhale) {
        setPhase("inhale");
        setTimer(phaseDurations.inhale - cycleProgress);
      } else if (cycleProgress < phaseDurations.inhale + phaseDurations.hold) {
        setPhase("hold");
        setTimer(phaseDurations.hold - (cycleProgress - phaseDurations.inhale));
      } else {
        setPhase("exhale");
        setTimer(phaseDurations.exhale - (cycleProgress - phaseDurations.inhale - phaseDurations.hold));
      }
      
      currentTime++;
    };

    updatePhase();
    phaseIntervalRef.current = setInterval(updatePhase, 1000);
  };

  const handleStart = () => {
    setIsActive(true);
    setSessionTime(0);
    setPhase("inhale");
    setTimer(phaseDurations.inhale);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSessionTime(0);
    setPhase("inhale");
    setTimer(phaseDurations.inhale);
  };

  const handleComplete = () => {
    setIsActive(false);
    const completedMinutes = Math.floor(sessionTime / 60);
    
    breathingMutation.mutate({
      duration: completedMinutes,
      completed: true,
    });

    toast({
      title: "Session Complete!",
      description: `Great job! You completed a ${completedMinutes}-minute breathing session.`,
    });

    handleReset();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseText = () => {
    switch (phase) {
      case "inhale": return "Inhale";
      case "hold": return "Hold";
      case "exhale": return "Exhale";
      default: return "Breathe";
    }
  };

  const getCircleScale = () => {
    switch (phase) {
      case "inhale": return "scale(1.1)";
      case "hold": return "scale(1.1)";
      case "exhale": return "scale(1)";
      default: return "scale(1)";
    }
  };

  return (
    <Card className="animate-fade-in bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
      <CardHeader>
        <CardTitle className="text-xl font-display text-center">
          Breathing Exercise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Breathing Circle */}
        <div className="flex flex-col items-center">
          <div 
            className="breathing-circle w-32 h-32 bg-primary-400 rounded-full flex items-center justify-center shadow-lg transition-transform duration-1000 ease-in-out"
            style={{ transform: isActive ? getCircleScale() : "scale(1)" }}
          >
            <span className="text-white font-medium text-lg">
              {getPhaseText()}
            </span>
          </div>
          <div className="mt-4 text-center">
            <div className="text-3xl font-bold text-primary-700">
              {Math.ceil(timer)}
            </div>
            <div className="text-sm text-gray-600">seconds</div>
          </div>
        </div>

        {/* Session Info */}
        <div className="text-center">
          <div className="text-lg font-medium text-gray-700">
            Session Time: {formatTime(sessionTime)}
          </div>
          <div className="text-sm text-gray-600">
            Goal: {selectedDuration} minutes
          </div>
          <div className="w-full bg-white rounded-full h-2 mt-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((sessionTime / (selectedDuration * 60)) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <div className="flex gap-2 justify-center">
            {!isActive ? (
              <Button 
                onClick={handleStart}
                className="bg-primary-500 hover:bg-primary-600"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Session
              </Button>
            ) : (
              <Button 
                onClick={handlePause}
                variant="outline"
                className="border-primary-300 text-primary-600"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            <Button 
              onClick={handleReset}
              variant="outline"
              className="border-primary-300 text-primary-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Duration Selection */}
          <div className="flex gap-2">
            {[3, 5, 10].map((duration) => (
              <Button
                key={duration}
                variant={selectedDuration === duration ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDuration(duration)}
                disabled={isActive}
                className="flex-1 text-sm"
              >
                {duration} min
              </Button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-600 bg-white rounded-lg p-3">
          <p>Follow the circle and breathing cues:</p>
          <p><strong>Inhale</strong> for 4 seconds • <strong>Hold</strong> for 4 seconds • <strong>Exhale</strong> for 6 seconds</p>
        </div>
      </CardContent>
    </Card>
  );
}
