
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const KM63_MANUAL_CONTEXT = `
REFERENCE MATERIAL: TOOLING MANUAL INTEGREX 100-IV/IVS/IVST (Manual No.: H372TA0021E)
The machine uses the KM63 Tooling System.

1. KM63 Turning Tools (Metric / Inch):
- O.D. Tool Holder (Forward Rotation): 20x20x100mm (Part: 53728007201) / 3/4"x3/4"x4" (Part: 53728008201)
- O.D. Tool Holder (Reverse Rotation): 20x20x100mm (Part: 53728007101) / 3/4"x3/4"x4" (Part: 53728008101)
- 45 deg O.D. Tool Holder (Forward): 20x20x85mm (Part: 53728007501) / 3/4"x3/4"x3" (Part: 53728008501)
- 45 deg O.D. Tool Holder (Reverse): 20x20x85mm (Part: 53728007401) / 3/4"x3/4"x3" (Part: 53728008401)
- Boring Bar Holder: Dia 32mm (Part: 53728007301) / Dia 1-1/4" (Part: 53728008301)
- Throw-away Tip Drill Holder: Dia 32mm (Part: 53728007601) / Dia 1.26" (Part: 53728007601)
- Cut-off Tool Holder (Option): Metric/Inch (Part: 53728009101, Type: 151.2-21-** Sandvik)

2. KM63 Milling Tools:
- Collet Chuck Holders (ER series):
  - ER11 (Part: 53738009501/53738010601)
  - ER16 (Part: 53738010801/53738010901)
  - ER25 (Part: 53738011101/53738011201)
  - ER32 (Part: 53738011401/53738011501)
  - ER40 (Part: 53738011601/53738011701)
`;

const MAINTENANCE_MANUAL_CONTEXT = `
REFERENCE MATERIAL: MAINTENANCE MANUAL INTEGREX 100-IV/IVS/IVST (Manual No.: H372MA0021E)

1. INSPECTION SCHEDULE:
- Daily: Check oil levels (Centralized lube, Coolant, Chiller, Hydraulic), Air pressure (0.5 MPa), Clean chips.
- Weekly: Check Emergency Stop, Wipers (Part: 33735090060 etc.), Clean air filter of hydraulic unit.
- 6-Month: Replace Hydraulic oil/filter, Replace Coolant, Grease fixed work rest.
- Annual: Replace Suction filter (centralized lube), Mist-separator element, Upper turret oil (SHC 629).

2. LUBRICATION & OILS:
- Hydraulic Unit (20L): DTE 24 (Mobil), UNI POWER 32 (Esso), or TELLUS OIL 32 (Shell).
- C-Axis Brake (1.8L) & ATC (6.5L): VACTRA No. 2 (Mobil) or FEBIS K68 (Esso).
- Upper Turret B-Axis (1.5L): SHC 629 (Mobil).
- Grease (Chuck): KLUEBER PASTE ME31-52.
- Grease (Slide ways): BEACON EP1 (Esso) or MOBILUX EP1 (Mobil).

3. ZERO POINT ADJUSTMENT:
- X-axis: Turn test piece, measure diameter (D). Move X-axis by 390 - [274 + D/2] mm. (Zero point is 390mm from spindle center).
- Z-axis: Face turn, measure length (L). Move Z-axis by [673 - (35 + L)] mm.
- W-axis (Sub-spindle): W-axis zero is at distance Wo (1032mm for IVS/IVST) between gauge lines.
- Tailstock (W-axis): Use [TAIL HOME SET MODE] in machine menu. Reference position is 787.3mm from spindle nose.

4. ALARMS & TROUBLESHOOTING:
- Alarm 217 THERMAL TRIP: Overloading of motors. Reset thermal relays:
  - FR11: Hydraulic pump motor.
  - FR13: Coolant pump motor.
  - FR14: Chip conveyor motor.
- Alarm 203 MILL SPINDLE OIL PRESS DOWN: Check pressure switch (SP25, SP26), replenish coolant.
- Headstock Cooling Fan: Filter located underneath headstock. Clean monthly.
- Battery Replacement: MR-J2 Amplifiers use battery Part No. D80MA008490 (MR-BAT).
`;

const PARAMETER_ALARM_MCODE_CONTEXT = `
REFERENCE MATERIAL: PARAMETER LIST / ALARM LIST / M-CODE LIST INTEGREX 100-IV/IVS/IVST (Manual No.: H372HA0012E)

1. PARAMETERS:
- User Parameters:
  - D (Point): D1 (2nd R-point height), D2 (Spot-machining tool dia), D22 (Tapping dwell), D49 (Planetary tapping return).
  - E (Line/Face/3D): E1 (Closed pattern start/escape), E4 (Radial finish allowance), E6 (Axial finish allowance), E16 (End mill peripheral override).
  - F (EIA/ISO): F1 (Corner decel coeff), F88 (G-code conversion), F114 (Inch/Metric C-axis feed).
  - TC (Turning): TC47 (Pecking return dist), TC50 (Cut-off feed reduction), TC82 (Chamfering coeff).
- Machine Parameters:
  - K (Measure): K1 (C-axis rotational radius), K12 (Manual measurement tolerance).
  - L (Table): L21 (Index table output type), L46 (Max pallets).
  - M (Feed Vel): M1 (Rapid feed rate), M8/M9 (Soft limits).
  - SA (Spindle): SA1-8 (Max RPM), SA41 (Orient speed).

2. ALARMS:
- System/Drive (No. 1-99, 1000+):
  - 2 EMERGENCY STOP: Hardware trouble.
  - 3 EMERGENCY STOP: E-stop button pressed.
  - 21 SYSTEM ERROR: Software abnormal.
  - 31 SERVO MALFUNCTION 1: Power-off level error.
- CNC Control (No. 100-199, 1100+):
  - 128 OUTSIDE INTERLOCK AXIS: Axis interlocked.
  - 144 ILLEGAL CYCLE START: Start conditions not met (e.g., door open 0x115).
  - 148 CHUCK BARRIER: Tool entered chuck barrier.
- PLC Control (No. 200-399, 1200+):
  - 200 HYDRAULIC UNIT PRESSURE DOWN: Check pressure/thermal relay (KM10).
  - 217 THERMAL TRIP: Overload. Check FR11, FR13, FR14.
  - 226 TOOL BREAKAGE: Broken tool detected.
  - 250 SPINDLE START MISOPERATION: Spindle start condition error.
  - 300 BREAKER TRIP: Circuit breaker tripped.

3. M-CODES (Miscellaneous Functions):
- Standard: M00 (Stop), M03 (Spindle FWD), M04 (Rev), M05 (Stop), M06 (Tool Change), M08 (Coolant ON), M09 (OFF).
- Clamping: M206/M207 (Chuck Open/Close), M210 (C-axis Clamp), M212 (Unclamp).
- Spindle Selection: M202 (Turning Spindle), M901 (HD1), M902 (HD2).
- Transfer: M540 (Transfer-Chuck Mode), M542 (Transfer-Bar Mode).
- Tailstock: M31 (Advance), M32 (Retract).
- Milling: M203 (Mill FWD), M204 (Mill Rev), M205 (Mill Stop).
`;

class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private getChat(): Chat {
    if (!this.chat) {
      this.chat = this.ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are IntegrexAI, an expert assistant for Mazak Integrex machines (Models: 100-IV, 100-IVS, 100-IVST).
Your knowledge comes from the specific Tooling, Maintenance, and Parameter/Alarm/M-Code manuals provided below.

CONTEXT - TOOLING (KM63):
${KM63_MANUAL_CONTEXT}

CONTEXT - MAINTENANCE:
${MAINTENANCE_MANUAL_CONTEXT}

CONTEXT - PARAMETERS, ALARMS, M-CODES:
${PARAMETER_ALARM_MCODE_CONTEXT}

Operational Guidelines:
1. Safety First: Always warn about "Main Power Breaker OFF" and "Lockout/Tagout" for maintenance queries.
2. Precision: Use exact part numbers (e.g., Battery D80MA008490), parameter numbers (e.g., TC47), and M-codes (e.g., M200).
3. Troubleshooting: If asked about specific alarms (e.g., 217, 203), refer to the specific thermal relay locations or pressure switches.
4. M-Codes: Differentiate between standard M-codes and those specific to the Integrex (e.g., M200 series for C-axis/Transfer).`,
        }
      });
    }
    return this.chat;
  }

  async *sendMessageStream(message: string): AsyncGenerator<string> {
    const chat = this.getChat();
    const result = await chat.sendMessageStream({ message });
    for await (const chunk of result) {
      const text = (chunk as GenerateContentResponse).text;
      if (text) {
        yield text;
      }
    }
  }
}

export const gemini = new GeminiService();
