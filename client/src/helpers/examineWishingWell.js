/**
 * Dependencies
 */

import travelTo from "./travelTo";
import axiosWithAuth from "./axiosWithAuth";
import { wait } from "./util";
import { baseUrl } from "./constants";

/**
 * Constants
 */

// Stack pointer is register R7
const SP = 7;
// Interrupt status is register R6
const IS = 6;
// Interrupt mask is register R5
const IM = 5;
// Opcodes
const NOP  = 0b00000000;
const HLT  = 0b00000001;
const RET  = 0b00010001;
const CALL = 0b01010000;
const JMP  = 0b01010100;
const JEQ  = 0b01010101;
const JNE  = 0b01010110;
const PUSH = 0b01000101;
const POP  = 0b01000110;
const PRA  = 0b01001000;
const PRN  = 0b01000111;
const LDI  = 0b10000010;
const LD   = 0b10000011;
const ST   = 0b10000100;
const INC  = 0b01100101;
const DEC  = 0b01100110;
const ADD  = 0b10100000;
const SUB  = 0b10100001;
const MOD  = 0b10100100;
const AND  = 0b10101000;
const OR   = 0b10101010;
const XOR  = 0b10101011;
const NOT  = 0b01101001;
const SHL  = 0b10101100;
const SHR  = 0b10101101;
const CMP  = 0b10100111;
const MUL  = 0b10100010;

/**
 * Define CPU class.
 */

class CPU {
  constructor() {
    this.running = false;

    // 256 bytes of memory
    this.ram = [...Array(256)].fill(0);
    // Create 8 registers, 1 byte each
    this.reg = [...Array(8)].fill(0);

    this.ir  = 0;  // Instruction Register
    this.pc  = 0;  // Program Counter
    this.mar = 0;  // Memory Address Register
    this.mdr = 0;  // Memory Data Register
    this.fl  = 0;  // Flags
    this.reg[IM] = 0;
    this.reg[IS] = 0;
    this.reg[SP] = 0xF4;

    this.branchtable = {}
    this.branchtable[NOP]  = this.handle_nop;
    this.branchtable[HLT]  = this.handle_hlt;
    this.branchtable[RET]  = this.handle_ret;
    this.branchtable[CALL] = this.handle_call;
    this.branchtable[JMP]  = this.handle_jmp;
    this.branchtable[JEQ]  = this.handle_jeq;
    this.branchtable[JNE]  = this.handle_jne;
    this.branchtable[PUSH] = this.handle_push;
    this.branchtable[POP]  = this.handle_pop;
    this.branchtable[PRA]  = this.handle_pra;
    this.branchtable[PRN]  = this.handle_prn;
    this.branchtable[LDI]  = this.handle_ldi;
    this.branchtable[LD]   = this.handle_ld;
    this.branchtable[ST]   = this.handle_st;
    this.branchtable[INC]  = this.handle_inc;
    this.branchtable[DEC]  = this.handle_dec;
    this.branchtable[ADD]  = this.handle_add;
    this.branchtable[SUB]  = this.handle_sub;
    this.branchtable[MOD]  = this.handle_mod;
    this.branchtable[AND]  = this.handle_and;
    this.branchtable[OR]   = this.handle_or;
    this.branchtable[NOT]  = this.handle_not;
    this.branchtable[XOR]  = this.handle_xor;
    this.branchtable[SHL]  = this.handle_shl;
    this.branchtable[SHR]  = this.handle_shr;
    this.branchtable[MUL]  = this.handle_mul;
    this.branchtable[CMP]  = this.handle_cmp;
  }

  /**
   * Load a program into memory.
   */

  load(message) {
    try {
      let address = 0;

      console.log('message', message);
      // lines = f.readlines()
      // for line in lines:
      //     # Process comments: Ignore anything after a # symbol
      //     comment_split = line.split("#")

      //     # Convert any numbers from binary strings to integers
      //     num = comment_split[0].strip()
      //     try:
      //         val = int(num, 2)
      //     except ValueError:
      //         continue

      //     this.ram[address] = val
      //     address += 1
    } catch (e) {
      console.error(e);
      process.exit(2);
    }
  }

  /**
   * Run the CPU.
   */

  run() {
    this.running = true;

    while (this.running) {
      this.ir = this.ram_read(this.pc);

      if (this.ir in this.branchtable) {
        this.branchtable[this.ir]();
      } else {
        console.log(`Unknown instruction: ${this.ir}`);
        process.exit(1);
      }

      if (this.pc >= this.ram.length - 1) {
        this.pc = 0;
      } else {
        this.pc += 1;
      }
    }
  }

  ram_read(pc) {
    return this.ram[pc];
  }

  ram_write(pc, instruction) {
    this.ram[pc] = instruction;
  }

  handle_nop() {
    continue
  }

  handle_hlt() {
    this.running = false;
  }

  handle_ret() {
    const register = this.ram_read(this.reg[SP]);
    this.reg[SP] += 1;
    this.pc += register - 1;
  }

  handle_call() {
    const reg_a = this.reg[this.ram_read(this.pc + 1)];
    this.reg[SP] -= 1;
    this.ram_write(htis.reg[SP], this.pc + 2);
    this.pc = reg_a;
  }

  handle_jmp() {
    const reg_a = this.reg[this.ram_read(this.pc + 1)];
    this.pc = reg_a - 1;
  }

  handle_jeq() {
    const reg_a = this.reg[this.ram_read(this.pc + 1)];
    if (this.fl === 1) {
      // If equal flag is true, jump to the address stored in register.
      this.pc = reg_a - 1;
    } else {
      this.pc += 1;
    }
  }

  handle_jne() {
    const reg_a = this.reg[this.ram_read(this.pc + 1)];
    if (this.fl > 1) {
      // If equal flag is false, jump to the address stored in register.
      this.pc = reg_a - 1;
    } else {
      this.pc += 1;
    }
  }

}

/**
 * Define helper
 */

async function examineWishingWell() {
  console.log('examineWishingWell()');
  try {
    await travelTo(55);

    const examineStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/examine/`, { name: "well" });
    console.log('examineStatus', examineStatus);
    await wait(examineStatus.data.cooldown);

    /**
     * Solve the puzzle.
     */

    const cpu = new CPU();
    const description = examineStatus.data.description;
    cpu.load(description);
    cpu.run();

    return true;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Export helper
 */

export default examineWishingWell;
