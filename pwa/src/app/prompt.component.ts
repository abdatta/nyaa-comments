import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-prompt',
    template: `
    <div class="install-buttons">
        <button mat-raised-button color="accent" (click)="addToHomescreen(true)"><b>{{prompt | uppercase}}</b></button>
        <button mat-button (click)="addToHomescreen(false)">LATER</button>
    </div>
    `,
    styles: [`
    .install-buttons {
        display: flex;
        justify-content: space-around;
        flex-flow: row-reverse;
        margin: 15px 0;
    }

    ::ng-deep .mat-raised-button.cdk-program-focused .mat-button-focus-overlay {
        opacity: 0;
    }
    `]
})
export class PromptComponent {

    constructor(private bottomSheetRef: MatBottomSheetRef<PromptComponent>,
                @Inject(MAT_BOTTOM_SHEET_DATA) public prompt: string) { }

    addToHomescreen(response: boolean) {
        this.bottomSheetRef.dismiss(response);
    }

}
