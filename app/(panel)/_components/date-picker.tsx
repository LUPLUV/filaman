import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";

export const DatePicker = ({onValueChange, value}: {onValueChange: (value: Date | undefined) => void; value: Date | undefined}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "PPP") : <span>Wähle ein Datum</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onValueChange}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}