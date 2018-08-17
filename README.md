# Train Checker

Ok so it kind of works, but not really...

If you follow the happy path it will work as expected, go a bit free form with it and it'll dump you out.

The basic idea of it came from something I do everyday, check if my train is knackered or not, with ScotRail there's a 90% chance it's late for some reason or another. The skill asks the user where would they are travelling to, the user will then provide the start and end point for the journey.

As the user provides the stations in a "human format" we have to convert them to station codes, at the moment this is done by referencing a CSV file for the correct value.

After this it takes the station code and performs a request to a public RSS feed hosted by JourneyCheck, the feed is processed and only returns the relevent details of a disruption to the user.

## Scripts

### Script 1
**U:** Alexa, open Train Checker  
**A:** Welcome to Train Checker, where are you travelling today?  
**U:** From hamilton central to yoker  
**A:** Ok, I'll check the trains between Hamilton central and yoker, is this correct?  
**U:** yes  
**A:** Ok, I'm checking HNC to YOK and found There are currently no reported updates on your route.  

### Script 2
**U:** Alexa, open Train Checker  
**A:** Welcome to Train Checker, where are you travelling today?  
**U:** From hamilton central  
**A:** Where will you be ending your journey  
**U:** yoker  
**A:** Ok, I'll check the trains between Hamilton central and yoker, is this correct?  
**U:** yes  
**A:** Ok, I'm checking HNC to YOK and found There are currently no reported updates on your route.  

### Script 3
**U:** Alexa, open Train Checker  
**A:** Welcome to Train Checker, where are you travelling today?  
**U:** From hamilton central to yoker  
**A:** Ok, I'll check the trains between Hamilton central and yoker, is this correct?  
**U:** no  
**A:** Oh that's a shame
