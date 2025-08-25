"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChevronDownIcon } from "lucide-react";
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";

import { useState, useEffect } from "react";

export default function InputCard({ userId, refresh }) {
  const categoryList = [
    "Housing",
    "Food",
    "Utilities",
    "Transport",
    "Shopping",
    "Entertainment",
    "Health",
    "Appearance",
    "Other",
  ];
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [addSuccess, setAddSuccess] = useState(0); // 0: for haven't add yet, 1 for success, 2 for failed
  const prefix = "https://omnic.space/api/spend";
  const handleSubmit = async () => {
    const amountFloat = parseFloat(amount);
    if (category === "" || amountFloat <= 0.0) {
      setAddSuccess(2);
      return;
    } else {
      const spendingObject = {
        userId,
        category,
        details,
        amount,
        date: date.toDateString(),
      };
      // console.log(spendingObject);

      try {
        const res = await fetch(`${prefix}/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(spendingObject),
        });
        if (res.ok) {
          setCategory("");
          setDetails("");
          setAmount("");
          setDate(undefined);
          setAddSuccess(1);
          // update the table
          refresh();
        } else {
          setAddSuccess(2);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Card className="w-full max-w-sm bg-card-background">
      <CardHeader>
        <CardTitle>Add New Spend</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
        {/* <CardAction>Card Action</CardAction> */}
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-2">
          <div className="grid gap-1">
            <Label htmlFor="category">Category:</Label>
            <Select
              id="category"
              value={category}
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Spend Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categoryList.map((category, index) => (
                    <SelectItem key={index} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1">
            <Label htmlFor="detail">Detail:</Label>
            <Input
              id="detail"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="amount">Amount:</Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="date" className="px-1">
              Date
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal"
                >
                  {date ? date.toLocaleString().split(",")[0] : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(selectedDate) => {
                    setDate(selectedDate);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </form>
      </CardContent>

      <CardFooter className="grid gap-2">
        <Button onClick={handleSubmit}>Add</Button>
        {addSuccess > 0 &&
          (addSuccess === 1 ? (
            <Alert>
              <CheckCircle2Icon />
              <AlertTitle>Success! New Record has been added!</AlertTitle>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Failed to add new record!</AlertTitle>
              <AlertDescription>
                Fill all the necessary fields!
              </AlertDescription>
            </Alert>
          ))}
      </CardFooter>
    </Card>
  );
}
