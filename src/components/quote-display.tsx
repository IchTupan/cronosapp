import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

interface QuoteDisplayProps {
  quote: string;
}

export function QuoteDisplay({ quote }: QuoteDisplayProps) {
  return (
    <Card className="glass-highlight border-white/10 border rounded-xl overflow-hidden">
      <CardContent className="pt-5 pb-4 px-4">
        <div className="flex gap-3">
          <Quote className="h-5 w-5 text-accent mt-0.5 flex-shrink-0 opacity-80" />
          <p className="italic text-sm text-theme-primary">{quote}</p>
        </div>
      </CardContent>
    </Card>
  )
}
